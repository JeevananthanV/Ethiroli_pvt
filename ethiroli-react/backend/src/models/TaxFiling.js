import crypto from 'crypto';
import pool from '../config/database.js';
import { decrypt } from '../config/encryption.js';

export default class TaxFiling {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      filer_name: row.filer_name ? decrypt(row.filer_name) : 'Compliance Officer',
      tax_payable: parseFloat(row.tax_payable || 0),
      tax_paid: parseFloat(row.tax_paid || 0)
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT t.*, u.full_name as filer_name
       FROM tax_filings t
       JOIN users u ON t.created_by = u.id
       WHERE t.id = ?`,
      [id]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async list({ return_type, status } = {}) {
    let sql = `
      SELECT t.*, u.full_name as filer_name
      FROM tax_filings t
      JOIN users u ON t.created_by = u.id
      WHERE 1=1
    `;
    const params = [];

    if (return_type) {
      sql += ' AND t.return_type = ?';
      params.push(return_type);
    }
    if (status) {
      sql += ' AND t.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY t.due_date DESC';
    const [rows] = await pool.query(sql, params);
    return rows.map(r => this.format(r));
  }

  static async create({
    id = crypto.randomUUID(),
    return_type,
    filing_period,
    due_date,
    filed_date = null,
    arn_number = null,
    tax_payable = 0.00,
    tax_paid = 0.00,
    status = 'DRAFT',
    acknowledgment_url = null,
    created_by
  }) {
    await pool.execute(
      `INSERT INTO tax_filings
       (id, return_type, filing_period, due_date, filed_date, arn_number, tax_payable, tax_paid, status, acknowledgment_url, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, return_type, filing_period, due_date, filed_date, arn_number, tax_payable, tax_paid, status, acknowledgment_url, created_by]
    );
    return { id, status };
  }

  static async recordFiling(id, { filed_date = new Date(), arn_number, tax_paid, acknowledgment_url = null }) {
    await pool.execute(
      `UPDATE tax_filings
       SET status = 'FILED',
           filed_date = ?,
           arn_number = ?,
           tax_paid = ?,
           acknowledgment_url = COALESCE(?, acknowledgment_url)
       WHERE id = ?`,
      [filed_date, arn_number, tax_paid, acknowledgment_url, id]
    );
    return this.findById(id);
  }
}
