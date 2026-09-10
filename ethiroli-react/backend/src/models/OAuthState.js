import pool from '../config/database.js';

export default class OAuthState {
  static format(row) {
    if (!row) return null;
    return row;
  }

  static async create({ state, portalSlug, redirectUri, expiresAt }) {
    const [result] = await pool.execute(
      `INSERT INTO oauth_states (state, portal_slug, redirect_uri, expires_at)
       VALUES (?, ?, ?, ?)`,
      [state, portalSlug, redirectUri, expiresAt]
    );
    return { id: result.insertId, state, portalSlug, redirectUri, expiresAt };
  }

  static async findByState(state) {
    const [rows] = await pool.execute(
      'SELECT * FROM oauth_states WHERE state = ? AND expires_at > CURRENT_TIMESTAMP',
      [state]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async deleteByState(state) {
    await pool.execute('DELETE FROM oauth_states WHERE state = ?', [state]);
  }

  static async deleteExpired() {
    await pool.execute('DELETE FROM oauth_states WHERE expires_at < CURRENT_TIMESTAMP');
  }
}
