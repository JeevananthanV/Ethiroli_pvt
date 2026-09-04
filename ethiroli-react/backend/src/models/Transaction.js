import pool from '../config/database.js';

export default class Transaction {
  static async list({ type, category } = {}) {
    let query = 'SELECT * FROM transactions WHERE 1=1';
    const values = [];

    if (type) {
      query += ' AND type = ?';
      values.push(type);
    }
    if (category) {
      query += ' AND category = ?';
      values.push(category);
    }

    query += ' ORDER BY date DESC';
    const [rows] = await pool.execute(query, values);
    return rows;
  }

  static async create({ type, category, amount, date, description = null, invoice_id = null, gst_applicable = false, gst_amount = 0.00, created_by }) {
    await pool.execute(
      `INSERT INTO transactions (type, category, amount, date, description, invoice_id, gst_applicable, gst_amount, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [type, category, amount, date, description, invoice_id, gst_applicable, gst_amount, created_by]
    );
  }
}