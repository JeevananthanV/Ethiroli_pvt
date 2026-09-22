import pool from '../config/database.js';

export default class AuditLog {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      old_value: row.old_value ? JSON.parse(row.old_value) : null,
      new_value: row.new_value ? JSON.parse(row.new_value) : null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM audit_logs WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

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
