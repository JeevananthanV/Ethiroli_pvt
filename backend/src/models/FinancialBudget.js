import crypto from 'crypto';
import pool from '../config/database.js';
import { decrypt } from '../config/encryption.js';

export default class FinancialBudget {
  static format(row) {
    if (!row) return null;
    const allocated = parseFloat(row.allocated_amount || 0);
    const spent = parseFloat(row.spent_amount || 0);
    const variance = allocated - spent;
    const utilization_percentage = allocated > 0 ? ((spent / allocated) * 100).toFixed(1) : 0;

    return {
      ...row,
      creator_name: row.creator_name ? decrypt(row.creator_name) : 'Finance Admin',
      allocated_amount: allocated,
      spent_amount: spent,
      variance,
      utilization_percentage: parseFloat(utilization_percentage)
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT b.*, u.full_name as creator_name
       FROM financial_budgets b
       JOIN users u ON b.created_by = u.id
       WHERE b.id = ?`,
      [id]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async list({ fiscal_year, quarter, department } = {}) {
    let sql = `
      SELECT b.*, u.full_name as creator_name
      FROM financial_budgets b
      JOIN users u ON b.created_by = u.id
      WHERE 1=1
    `;
    const params = [];

    if (fiscal_year) {
      sql += ' AND b.fiscal_year = ?';
      params.push(fiscal_year);
    }
    if (quarter) {
      sql += ' AND b.quarter = ?';
      params.push(quarter);
    }
    if (department) {
      sql += ' AND b.department = ?';
      params.push(department);
    }

    sql += ' ORDER BY b.fiscal_year DESC, b.quarter ASC, b.allocated_amount DESC';
    const [rows] = await pool.query(sql, params);
    return rows.map(r => this.format(r));
  }

  static async create({
    id = crypto.randomUUID(),
    fiscal_year,
    quarter,
    department,
    category,
    allocated_amount,
    spent_amount = 0.00,
    currency = 'INR',
    notes = null,
    created_by
  }) {
    await pool.execute(
      `INSERT INTO financial_budgets
       (id, fiscal_year, quarter, department, category, allocated_amount, spent_amount, currency, notes, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         allocated_amount = VALUES(allocated_amount),
         spent_amount = VALUES(spent_amount),
         notes = VALUES(notes)`,
      [id, fiscal_year, quarter, department, category, allocated_amount, spent_amount, currency, notes, created_by]
    );
    return { id };
  }

  static async recordSpend(fiscal_year, quarter, department, category, amount) {
    await pool.execute(
      `UPDATE financial_budgets
       SET spent_amount = spent_amount + ?
       WHERE fiscal_year = ? AND quarter = ? AND department = ? AND category = ?`,
      [amount, fiscal_year, quarter, department, category]
    );
  }
}
