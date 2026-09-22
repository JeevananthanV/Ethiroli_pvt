import pool from '../config/database.js';

export default class ActivityFeed {
  static format(row) {
    if (!row) return null;
    return row;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM activity_feeds WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ user_id, actor_id = null, event_type, entity_type, entity_id = null, payload = null }) {
    const [result] = await pool.execute(
      `INSERT INTO activity_feeds (user_id, actor_id, event_type, entity_type, entity_id, payload)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        actor_id,
        event_type,
        entity_type,
        entity_id,
        payload ? JSON.stringify(payload) : null
      ]
    );
    return result.insertId || result.info;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.is_read !== undefined) { queryParts.push('is_read = ?'); values.push(updates.is_read); }
    if (updates.payload !== undefined) { queryParts.push('payload = ?'); values.push(updates.payload ? JSON.stringify(updates.payload) : null); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE activity_feeds SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM activity_feeds WHERE id = ?', [id]);
  }

  static async list({ user_id, limit = 50, offset = 0 } = {}) {
    let query = `
      SELECT f.*, u.email as actor_email, u.full_name as actor_name
      FROM activity_feeds f
      LEFT JOIN users u ON f.actor_id = u.id
      WHERE 1=1
    `;
    const values = [];

    if (user_id) { query += ' AND f.user_id = ?'; values.push(user_id); }

    query += ' ORDER BY f.created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ user_id } = {}) {
    let query = 'SELECT COUNT(*) as total FROM activity_feeds WHERE 1=1';
    const values = [];

    if (user_id) { query += ' AND user_id = ?'; values.push(user_id); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }

  static async listForUser(user_id, { limit = 50, offset = 0 } = {}) {
    return this.list({ user_id, limit, offset });
  }

  static async markAsRead(id, user_id) {
    await pool.execute(
      'UPDATE activity_feeds SET is_read = TRUE WHERE id = ? AND user_id = ?',
      [id, user_id]
    );
  }
}
