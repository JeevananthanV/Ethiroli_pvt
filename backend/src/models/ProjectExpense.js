import crypto from 'crypto';
import pool from '../config/database.js';
import { decrypt } from '../config/encryption.js';

export default class ProjectExpense {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      logged_by_name: row.logger_name ? decrypt(row.logger_name) : 'Team Member',
      approver_name: row.approver_name ? decrypt(row.approver_name) : null,
      amount: parseFloat(row.amount || 0)
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT e.*, 
              u.full_name as logger_name, 
              appr.full_name as approver_name,
              p.name as project_name
       FROM project_expenses e
       JOIN users u ON e.logged_by = u.id
       LEFT JOIN users appr ON e.approved_by = appr.id
       JOIN student_projects p ON e.project_id = p.id
       WHERE e.id = ?`,
      [id]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({
    id = crypto.randomUUID(),
    project_id,
    logged_by,
    category,
    description,
    amount,
    currency = 'INR',
    expense_date,
    receipt_url = null,
    is_billable = true,
    status = 'PENDING'
  }) {
    await pool.execute(
      `INSERT INTO project_expenses
       (id, project_id, logged_by, category, description, amount, currency, expense_date, receipt_url, is_billable, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, project_id, logged_by, category, description, amount, currency, expense_date, receipt_url, is_billable, status]
    );
    return { id, status };
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.category !== undefined) { queryParts.push('category = ?'); values.push(updates.category); }
    if (updates.description !== undefined) { queryParts.push('description = ?'); values.push(updates.description); }
    if (updates.amount !== undefined) { queryParts.push('amount = ?'); values.push(updates.amount); }
    if (updates.expense_date !== undefined) { queryParts.push('expense_date = ?'); values.push(updates.expense_date); }
    if (updates.receipt_url !== undefined) { queryParts.push('receipt_url = ?'); values.push(updates.receipt_url); }
    if (updates.is_billable !== undefined) { queryParts.push('is_billable = ?'); values.push(updates.is_billable); }
    if (updates.status !== undefined) { queryParts.push('status = ?'); values.push(updates.status); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE project_expenses SET ${queryParts.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }

  static async approve(id, approved_by) {
    await pool.execute(
      `UPDATE project_expenses 
       SET status = 'APPROVED', approved_by = ?, approved_at = NOW() 
       WHERE id = ?`,
      [approved_by, id]
    );
    return this.findById(id);
  }

  static async reject(id, approved_by) {
    await pool.execute(
      `UPDATE project_expenses 
       SET status = 'REJECTED', approved_by = ?, approved_at = NOW() 
       WHERE id = ?`,
      [approved_by, id]
    );
    return this.findById(id);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM project_expenses WHERE id = ?', [id]);
  }

  static async list({ project_id, status, limit = 50, offset = 0 } = {}) {
    let query = `
      SELECT e.*, 
             u.full_name as logger_name, 
             appr.full_name as approver_name,
             p.name as project_name
      FROM project_expenses e
      JOIN users u ON e.logged_by = u.id
      LEFT JOIN users appr ON e.approved_by = appr.id
      JOIN student_projects p ON e.project_id = p.id
      WHERE 1=1
    `;
    const values = [];

    if (project_id) { query += ' AND e.project_id = ?'; values.push(project_id); }
    if (status) { query += ' AND e.status = ?'; values.push(status); }

    query += ' ORDER BY e.expense_date DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async getSummary(project_id) {
    let query = `
      SELECT 
        COUNT(*) as total_records,
        COALESCE(SUM(amount), 0) as total_expenses,
        COALESCE(SUM(CASE WHEN is_billable = TRUE THEN amount ELSE 0 END), 0) as billable_expenses,
        COALESCE(SUM(CASE WHEN status = 'APPROVED' THEN amount ELSE 0 END), 0) as approved_expenses,
        COALESCE(SUM(CASE WHEN status = 'PENDING' THEN amount ELSE 0 END), 0) as pending_expenses
      FROM project_expenses
      WHERE 1=1
    `;
    const values = [];
    if (project_id) {
      query += ' AND project_id = ?';
      values.push(project_id);
    }
    const [rows] = await pool.execute(query, values);
    return {
      total_records: rows[0].total_records,
      total_expenses: parseFloat(rows[0].total_expenses || 0),
      billable_expenses: parseFloat(rows[0].billable_expenses || 0),
      approved_expenses: parseFloat(rows[0].approved_expenses || 0),
      pending_expenses: parseFloat(rows[0].pending_expenses || 0)
    };
  }
}
