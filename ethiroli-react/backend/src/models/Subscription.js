import pool from '../config/database.js';

export default class Subscription {
  static format(row) {
    if (!row) return null;
    return row;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM subscriptions WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ client_id, service_name, monthly_fee, start_date, renewal_date, is_active = true }) {
    const [result] = await pool.execute(
      `INSERT INTO subscriptions (client_id, service_name, monthly_fee, start_date, renewal_date, is_active)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [client_id, service_name, monthly_fee, start_date, renewal_date, is_active]
    );
    return result.insertId || result.info;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.service_name !== undefined) { queryParts.push('service_name = ?'); values.push(updates.service_name); }
    if (updates.monthly_fee !== undefined) { queryParts.push('monthly_fee = ?'); values.push(updates.monthly_fee); }
    if (updates.start_date !== undefined) { queryParts.push('start_date = ?'); values.push(updates.start_date); }
    if (updates.renewal_date !== undefined) { queryParts.push('renewal_date = ?'); values.push(updates.renewal_date); }
    if (updates.is_active !== undefined) { queryParts.push('is_active = ?'); values.push(updates.is_active); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE subscriptions SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM subscriptions WHERE id = ?', [id]);
  }

  static async list({ client_id, is_active, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM subscriptions WHERE 1=1';
    const values = [];

    if (client_id) { query += ' AND client_id = ?'; values.push(client_id); }
    if (is_active !== undefined) { query += ' AND is_active = ?'; values.push(is_active); }

    query += ' ORDER BY renewal_date ASC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ client_id, is_active } = {}) {
    let query = 'SELECT COUNT(*) as total FROM subscriptions WHERE 1=1';
    const values = [];

    if (client_id) { query += ' AND client_id = ?'; values.push(client_id); }
    if (is_active !== undefined) { query += ' AND is_active = ?'; values.push(is_active); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
