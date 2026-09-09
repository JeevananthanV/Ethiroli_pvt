import crypto from 'crypto';
import pool from '../config/database.js';

export default class DeviceRegistration {
  static format(row) {
    if (!row) return null;
    return row;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM device_registrations WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ user_id, tenant_id, device_id, platform, push_token, app_version = null, is_active = true }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO device_registrations (id, user_id, tenant_id, device_id, platform, push_token, app_version, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE push_token = VALUES(push_token), last_active_at = CURRENT_TIMESTAMP`,
      [id, user_id, tenant_id, device_id, platform, push_token, app_version, is_active]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.platform !== undefined) { queryParts.push('platform = ?'); values.push(updates.platform); }
    if (updates.push_token !== undefined) { queryParts.push('push_token = ?'); values.push(updates.push_token); }
    if (updates.app_version !== undefined) { queryParts.push('app_version = ?'); values.push(updates.app_version); }
    if (updates.is_active !== undefined) { queryParts.push('is_active = ?'); values.push(updates.is_active); }
    if (updates.last_active_at !== undefined) { queryParts.push('last_active_at = ?'); values.push(updates.last_active_at); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE device_registrations SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM device_registrations WHERE id = ?', [id]);
  }

  static async list({ user_id, tenant_id, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM device_registrations WHERE 1=1';
    const values = [];

    if (user_id) { query += ' AND user_id = ?'; values.push(user_id); }
    if (tenant_id) { query += ' AND tenant_id = ?'; values.push(tenant_id); }

    query += ' ORDER BY last_active_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ user_id, tenant_id } = {}) {
    let query = 'SELECT COUNT(*) as total FROM device_registrations WHERE 1=1';
    const values = [];

    if (user_id) { query += ' AND user_id = ?'; values.push(user_id); }
    if (tenant_id) { query += ' AND tenant_id = ?'; values.push(tenant_id); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
