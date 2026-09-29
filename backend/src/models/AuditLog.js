import pool from '../config/database.js';
import { logger } from '../config/logger.js';

export default class AuditLog {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      old_value: row.old_value ? (typeof row.old_value === 'string' ? JSON.parse(row.old_value) : row.old_value) : null,
      new_value: row.new_value ? (typeof row.new_value === 'string' ? JSON.parse(row.new_value) : row.new_value) : null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM audit_logs WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({
    user_id = null,
    action,
    entity_type,
    entity_id = null,
    old_value = null,
    new_value = null,
    metadata = null,
    portal_slug = null,
    ip_address = null,
    user_agent = null
  }) {
    try {
      // 1. Merge metadata / portal_slug into new_value if provided
      let finalNewValue = new_value;
      if (metadata || portal_slug) {
        finalNewValue = typeof new_value === 'object' && new_value !== null ? { ...new_value } : {};
        if (metadata && typeof metadata === 'object') {
          Object.assign(finalNewValue, metadata);
        } else if (metadata) {
          finalNewValue.metadata = metadata;
        }
        if (portal_slug) {
          finalNewValue.portal_slug = portal_slug;
        }
      }

      // 2. Normalize and truncate fields to prevent SQL length exceptions
      const normalizedEntityId = entity_id ? String(entity_id).slice(0, 255) : null;
      const normalizedUserAgent = user_agent ? String(user_agent).slice(0, 500) : null;
      const normalizedIp = ip_address ? String(ip_address).slice(0, 45) : null;

      await pool.execute(
        `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_value, new_value, ip_address, user_agent)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user_id,
          action,
          entity_type,
          normalizedEntityId,
          old_value ? JSON.stringify(old_value) : null,
          finalNewValue ? JSON.stringify(finalNewValue) : null,
          normalizedIp,
          normalizedUserAgent
        ]
      );
    } catch (err) {
      logger.error('Failed to write audit log entry', {
        error: err.message,
        action,
        entity_type,
        entity_id,
        user_id
      });
    }
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.action !== undefined) { queryParts.push('action = ?'); values.push(updates.action); }
    if (updates.old_value !== undefined) { queryParts.push('old_value = ?'); values.push(updates.old_value ? JSON.stringify(updates.old_value) : null); }
    if (updates.new_value !== undefined) { queryParts.push('new_value = ?'); values.push(updates.new_value ? JSON.stringify(updates.new_value) : null); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE audit_logs SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM audit_logs WHERE id = ?', [id]);
  }

  static async list({ user_id, action, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT a.*, u.email as user_email FROM audit_logs a LEFT JOIN users u ON a.user_id = u.id WHERE 1=1';
    const values = [];

    if (user_id) { query += ' AND a.user_id = ?'; values.push(user_id); }
    if (action) { query += ' AND a.action = ?'; values.push(action); }

    query += ' ORDER BY a.created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ user_id, action } = {}) {
    let query = 'SELECT COUNT(*) as total FROM audit_logs WHERE 1=1';
    const values = [];

    if (user_id) { query += ' AND user_id = ?'; values.push(user_id); }
    if (action) { query += ' AND action = ?'; values.push(action); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
