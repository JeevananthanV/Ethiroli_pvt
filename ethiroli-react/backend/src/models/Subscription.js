import pool from '../config/database.js';

export default class Subscription {
  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM subscriptions WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async create({ client_id, service_name, monthly_fee, start_date, renewal_date }) {
    const [result] = await pool.execute(
      `INSERT INTO subscriptions (client_id, service_name, monthly_fee, start_date, renewal_date)
       VALUES (?, ?, ?, ?, ?)`,
      [client_id, service_name, monthly_fee, start_date, renewal_date]
    );
    return result.insertId || result.info;
  }

  static async update(id, { is_active, renewal_date }) {
    await pool.execute(
      `UPDATE subscriptions SET is_active = ?, renewal_date = ? WHERE id = ?`,
      [is_active, renewal_date, id]
    );
  }

  static async list({ client_id, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM subscriptions WHERE 1=1';
    const values = [];

    if (client_id) {
      query += ' AND client_id = ?';
      values.push(client_id);
    }

    query += ' LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows;
  }
}