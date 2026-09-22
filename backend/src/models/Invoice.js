import crypto from 'crypto';
import pool from '../config/database.js';

export default class Invoice {
  static format(row) {
    if (!row) return null;
    return row;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM invoices WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ invoice_number, client_id = null, student_id = null, issue_date, due_date, subtotal, gst_rate = 0.00, gst_amount = 0.00, total, is_recurring = false, recurring_schedule_id = null, created_by }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO invoices (id, invoice_number, client_id, student_id, issue_date, due_date, subtotal, gst_rate, gst_amount, total, is_recurring, recurring_schedule_id, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, invoice_number, client_id, student_id, issue_date, due_date, subtotal, gst_rate, gst_amount, total, is_recurring, recurring_schedule_id, created_by]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.invoice_number !== undefined) { queryParts.push('invoice_number = ?'); values.push(updates.invoice_number); }
    if (updates.status !== undefined) { queryParts.push('status = ?'); values.push(updates.status); }
    if (updates.subtotal !== undefined) { queryParts.push('subtotal = ?'); values.push(updates.subtotal); }
    if (updates.gst_rate !== undefined) { queryParts.push('gst_rate = ?'); values.push(updates.gst_rate); }
    if (updates.gst_amount !== undefined) { queryParts.push('gst_amount = ?'); values.push(updates.gst_amount); }
    if (updates.total !== undefined) { queryParts.push('total = ?'); values.push(updates.total); }
    if (updates.sent_at !== undefined) { queryParts.push('sent_at = ?'); values.push(updates.sent_at); }
    if (updates.paid_at !== undefined) { queryParts.push('paid_at = ?'); values.push(updates.paid_at); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE invoices SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM invoices WHERE id = ?', [id]);
  }

  static async list({ status, client_id, student_id, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM invoices WHERE 1=1';
    const values = [];

    if (status) { query += ' AND status = ?'; values.push(status); }
    if (client_id) { query += ' AND client_id = ?'; values.push(client_id); }
    if (student_id) { query += ' AND student_id = ?'; values.push(student_id); }

    query += ' ORDER BY due_date DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ status, client_id, student_id } = {}) {
    let query = 'SELECT COUNT(*) as total FROM invoices WHERE 1=1';
    const values = [];

    if (status) { query += ' AND status = ?'; values.push(status); }
    if (client_id) { query += ' AND client_id = ?'; values.push(client_id); }
    if (student_id) { query += ' AND student_id = ?'; values.push(student_id); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }

  static async updateStatus(id, status, paid_at = null) {
    await pool.execute(
      'UPDATE invoices SET status = ?, paid_at = ? WHERE id = ?',
      [status, paid_at, id]
    );
  }
}
