import crypto from 'crypto';
import pool from '../config/database.js';

export default class CartSession {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      items: row.items ? JSON.parse(row.items) : []
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM cart_sessions WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async getByUserId(userId) {
    const [rows] = await pool.execute(
      'SELECT * FROM cart_sessions WHERE user_id = ? AND expires_at > CURRENT_TIMESTAMP ORDER BY created_at DESC LIMIT 1',
      [userId]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ tenant_id, user_id = null, session_token, items, expires_at }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO cart_sessions (id, tenant_id, user_id, session_token, items, expires_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, tenant_id, user_id, session_token, JSON.stringify(items), expires_at]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.items !== undefined) { queryParts.push('items = ?'); values.push(JSON.stringify(updates.items)); }
    if (updates.coupon_code !== undefined) { queryParts.push('coupon_code = ?'); values.push(updates.coupon_code); }
    if (updates.expires_at !== undefined) { queryParts.push('expires_at = ?'); values.push(updates.expires_at); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE cart_sessions SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM cart_sessions WHERE id = ?', [id]);
  }

  static async list({ tenant_id, user_id, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM cart_sessions WHERE 1=1';
    const values = [];

    if (tenant_id) { query += ' AND tenant_id = ?'; values.push(tenant_id); }
    if (user_id) { query += ' AND user_id = ?'; values.push(user_id); }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ tenant_id, user_id } = {}) {
    let query = 'SELECT COUNT(*) as total FROM cart_sessions WHERE 1=1';
    const values = [];

    if (tenant_id) { query += ' AND tenant_id = ?'; values.push(tenant_id); }
    if (user_id) { query += ' AND user_id = ?'; values.push(user_id); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
