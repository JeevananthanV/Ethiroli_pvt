import pool from '../config/database.js';

export default class Session {
  static async create({ user_id, token, expires_at, user_agent = null, ip_address = null }) {
    await pool.execute(
      `INSERT INTO sessions (user_id, token, expires_at, user_agent, ip_address)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, token, expires_at, user_agent, ip_address]
    );
  }

  static async findByToken(token) {
    const [rows] = await pool.execute(
      `SELECT s.*, u.role, u.email, u.full_name, u.is_active 
       FROM sessions s
       JOIN users u ON s.user_id = u.id
       WHERE s.token = ? AND s.expires_at > CURRENT_TIMESTAMP`,
      [token]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  static async deleteByToken(token) {
    await pool.execute('DELETE FROM sessions WHERE token = ?', [token]);
  }

  static async deleteByUserId(user_id) {
    await pool.execute('DELETE FROM sessions WHERE user_id = ?', [user_id]);
  }
}
