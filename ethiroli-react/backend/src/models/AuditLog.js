import pool from '../config/database.js';

export default class AuditLog {
  static async create({ user_id = null, action, entity_type, entity_id = null, old_value = null, new_value = null, ip_address = null, user_agent = null }) {
    await pool.execute(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_value, new_value, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        action,
        entity_type,
        entity_id,
        old_value ? JSON.stringify(old_value) : null,
        new_value ? JSON.stringify(new_value) : null,
        ip_address,
        user_agent
      ]
    );
  }

  static async list({ user_id, action, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT a.*, u.email as user_email FROM audit_logs a LEFT JOIN users u ON a.user_id = u.id WHERE 1=1';
    const values = [];

    if (user_id) {
      query += ' AND a.user_id = ?';
      values.push(user_id);
    }
    if (action) {
      query += ' AND a.action = ?';
      values.push(action);
    }

    query += ' ORDER BY a.created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows;
  }
}
