import pool from '../config/database.js';

export default class Session {
  static format(row) {
    if (!row) return null;
    return row;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM sessions WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async findByToken(token) {
    const [rows] = await pool.execute(
      `SELECT s.*, u.role, u.email, u.full_name, u.is_active,
              tu.tenant_id, tu.tenant_role
       FROM sessions s
       JOIN users u ON s.user_id = u.id
       LEFT JOIN tenant_users tu ON tu.user_id = u.id AND tu.is_primary = 1
       WHERE s.token = ? AND s.expires_at > CURRENT_TIMESTAMP`,
      [token]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ user_id, token, expires_at, user_agent = null, ip_address = null, portal_slug = 'app' }) {
    await pool.execute(
      `INSERT INTO sessions (user_id, token, portal_slug, expires_at, user_agent, ip_address)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, token, portal_slug, expires_at, user_agent, ip_address]
    );
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.expires_at !== undefined) { queryParts.push('expires_at = ?'); values.push(updates.expires_at); }
    if (updates.user_agent !== undefined) { queryParts.push('user_agent = ?'); values.push(updates.user_agent); }
    if (updates.ip_address !== undefined) { queryParts.push('ip_address = ?'); values.push(updates.ip_address); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE sessions SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM sessions WHERE id = ?', [id]);
  }

  static async deleteByToken(token) {
    await pool.execute('DELETE FROM sessions WHERE token = ?', [token]);
  }

  static async deleteByUserId(user_id) {
    await pool.execute('DELETE FROM sessions WHERE user_id = ?', [user_id]);
  }

  static async list({ user_id } = {}) {
    let query = 'SELECT * FROM sessions WHERE 1=1';
    const values = [];

    if (user_id) { query += ' AND user_id = ?'; values.push(user_id); }

    query += ' ORDER BY created_at DESC LIMIT 100';
    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ user_id } = {}) {
    let query = 'SELECT COUNT(*) as total FROM sessions WHERE 1=1';
    const values = [];

    if (user_id) { query += ' AND user_id = ?'; values.push(user_id); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
