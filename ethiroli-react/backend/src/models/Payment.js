import pool from '../config/database.js';

export default class Payment {
  static async list({ status } = {}) {
    let query = 'SELECT * FROM payments WHERE 1=1';
    const values = [];

    if (status) {
      query += ' AND status = ?';
      values.push(status);
    }

    const [rows] = await pool.execute(query, values);
    return rows;
  }

  static async create({ invoice_id, amount, payment_date, method, reference_number = null, status = 'PENDING', gateway_response = null }) {
    await pool.execute(
      `INSERT INTO payments (invoice_id, amount, payment_date, method, reference_number, status, gateway_response)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [invoice_id, amount, payment_date, method, reference_number, status, gateway_response ? JSON.stringify(gateway_response) : null]
    );
  }
}