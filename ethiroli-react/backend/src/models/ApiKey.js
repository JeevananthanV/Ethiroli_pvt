import crypto from 'crypto';
import pool from '../config/database.js';

export default class ApiKey {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      scopes: row.scopes ? JSON.parse(row.scopes) : null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM api_keys WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async findByKey(apiKey) {
    const [rows] = await pool.execute('SELECT * FROM api_keys WHERE api_key = ? AND is_active = TRUE', [apiKey]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ tenant_id, user_id, name, api_key, api_secret, scopes = null, rate_limit_per_minute = 60, expires_at = null, is_active = true }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO api_keys (id, tenant_id, user_id, name, api_key, api_secret, scopes, rate_limit_per_minute, expires_at, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, tenant_id, user_id, name, api_key, api_secret, scopes ? JSON.stringify(scopes) : null, rate_limit_per_minute, expires_at, is_active]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.name !== undefined) { queryParts.push('name = ?'); values.push(updates.name); }
    if (updates.scopes !== undefined) { queryParts.push('scopes = ?'); values.push(updates.scopes ? JSON.stringify(updates.scopes) : null); }
    if (updates.rate_limit_per_minute !== undefined) { queryParts.push('rate_limit_per_minute = ?'); values.push(updates.rate_limit_per_minute); }
    if (updates.expires_at !== undefined) { queryParts.push('expires_at = ?'); values.push(updates.expires_at); }
    if (updates.is_active !== undefined) { queryParts.push('is_active = ?'); values.push(updates.is_active); }
    if (updates.last_used_at !== undefined) { queryParts.push('last_used_at = ?'); values.push(updates.last_used_at); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE api_keys SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM api_keys WHERE id = ?', [id]);
  }

  static async list({ tenant_id, user_id, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM api_keys WHERE 1=1';
    const values = [];

    if (tenant_id) { query += ' AND tenant_id = ?'; values.push(tenant_id); }
    if (user_id) { query += ' AND user_id = ?'; values.push(user_id); }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ tenant_id, user_id } = {}) {
    let query = 'SELECT COUNT(*) as total FROM api_keys WHERE 1=1';
    const values = [];

    if (tenant_id) { query += ' AND tenant_id = ?'; values.push(tenant_id); }
    if (user_id) { query += ' AND user_id = ?'; values.push(user_id); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
