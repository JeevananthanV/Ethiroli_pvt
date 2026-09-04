import pool from '../config/database.js';

export default class ActivityFeed {
  static async create({ user_id, actor_id = null, event_type, entity_type, entity_id = null, payload = null }) {
    await pool.execute(
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
  }

  static async listForUser(user_id, { limit = 50, offset = 0 } = {}) {
    const [rows] = await pool.execute(
      `SELECT f.*, u.email as actor_email, u.full_name as actor_name
       FROM activity_feeds f
       LEFT JOIN users u ON f.actor_id = u.id
       WHERE f.user_id = ?
       ORDER BY f.created_at DESC
       LIMIT ? OFFSET ?`,
      [user_id, limit, offset]
    );
    return rows;
  }

  static async markAsRead(id, user_id) {
    await pool.execute(
      'UPDATE activity_feeds SET is_read = TRUE WHERE id = ? AND user_id = ?',
      [id, user_id]
    );
  }
}
