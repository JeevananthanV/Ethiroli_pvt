import crypto from 'crypto';
import pool from '../config/database.js';

export default class Invoice {
  static async list({ status, client_id, student_id } = {}) {
    let query = 'SELECT * FROM invoices WHERE 1=1';
    const values = [];

    if (status) {
      query += ' AND status = ?';
      values.push(status);
    }
    if (client_id) {
      query += ' AND client_id = ?';
      values.push(client_id);
    }
    if (student_id) {
      query += ' AND student_id = ?';
      values.push(student_id);
    }

    query += ' ORDER BY due_date DESC';
    const [rows] = await pool.execute(query, values);
    return rows;
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

  static async updateStatus(id, status, paid_at = null) {
    await pool.execute(
      'UPDATE invoices SET status = ?, paid_at = ? WHERE id = ?',
      [status, paid_at, id]
    );
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM invoices WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  }
}