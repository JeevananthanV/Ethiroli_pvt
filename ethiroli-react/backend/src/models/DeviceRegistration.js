import crypto from 'crypto';
import pool from '../config/database.js';

export default class DeviceRegistration {
  static async create({ user_id, tenant_id, device_id, platform, push_token }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO device_registrations (id, user_id, tenant_id, device_id, platform, push_token)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE push_token = VALUES(push_token), last_active_at = CURRENT_TIMESTAMP`,
      [id, user_id, tenant_id, device_id, platform, push_token]
    );
    return id;
  }

  static async list({ user_id } = {}) {
    let query = 'SELECT * FROM device_registrations';
    const values = [];

    if (user_id) {
      query += ' WHERE user_id = ?';
      values.push(user_id);
    }

    const [rows] = await pool.execute(query, values);
    return rows;
  }
}