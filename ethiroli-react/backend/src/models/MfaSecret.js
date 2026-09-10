import pool from '../config/database.js';

export default class MfaSecret {
  static format(row) {
    if (!row) return null;
    return row;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM mfa_secrets WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async findByUserId(userId) {
    const [rows] = await pool.execute('SELECT * FROM mfa_secrets WHERE user_id = ?', [userId]);
    return rows.length > 0 ? rows.map(row => this.format(row)) : [];
  }

  static async findActiveByUserId(userId) {
    const [rows] = await pool.execute(
      'SELECT * FROM mfa_secrets WHERE user_id = ? AND is_verified = TRUE LIMIT 1',
      [userId]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ user_id, secret, is_verified = false, backup_codes = null }) {
    const [result] = await pool.execute(
      `INSERT INTO mfa_secrets (user_id, secret, is_verified, backup_codes)
       VALUES (?, ?, ?, ?)`,
      [user_id, secret, is_verified ? 1 : 0, backup_codes ? JSON.stringify(backup_codes) : null]
    );
    return { id: result.insertId, user_id, secret, is_verified, backup_codes };
  }

  static async markVerified(id) {
    await pool.execute(
      'UPDATE mfa_secrets SET is_verified = TRUE, verified_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );
  }

  static async deleteByUserId(userId) {
    await pool.execute('DELETE FROM mfa_secrets WHERE user_id = ?', [userId]);
  }
}
