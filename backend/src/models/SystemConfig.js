import pool from '../config/database.js';

export default class SystemConfig {
  static format(row) {
    if (!row) return null;
    let val = row.config_value;
    if (typeof val === 'string') {
      try {
        val = JSON.parse(val);
      } catch {
        // Fallback to raw string if not valid JSON
      }
    }
    return {
      ...row,
      config_value: val
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM system_configs WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async get(key) {
    const [rows] = await pool.execute(
      'SELECT * FROM system_configs WHERE config_key = ?',
      [key]
    );
    if (rows.length === 0) return null;
    return this.format(rows[0]);
  }

  static async set(key, value) {
    const jsonVal = JSON.stringify(value);
    await pool.execute(
      `INSERT INTO system_configs (config_key, config_value)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE config_value = ?`,
      [key, jsonVal, jsonVal]
    );
  }

  static async save(key, value) {
    return this.set(key, value);
  }

  static async create(data) {
    const { config_key, config_value, is_encrypted = false } = data;
    const jsonVal = JSON.stringify(config_value);
    const [result] = await pool.execute(
      `INSERT INTO system_configs (config_key, config_value, is_encrypted) VALUES (?, ?, ?)`,
      [config_key, jsonVal, is_encrypted]
    );
    return result.insertId;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.config_value !== undefined) { queryParts.push('config_value = ?'); values.push(JSON.stringify(updates.config_value)); }
    if (updates.is_encrypted !== undefined) { queryParts.push('is_encrypted = ?'); values.push(updates.is_encrypted); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE system_configs SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM system_configs WHERE id = ?', [id]);
  }

  static async list({ limit = 50, offset = 0 } = {}) {
    const [rows] = await pool.execute(
      'SELECT * FROM system_configs ORDER BY updated_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    return rows.map(row => this.format(row));
  }

  static async count() {
    const [rows] = await pool.execute('SELECT COUNT(*) as total FROM system_configs');
    return rows[0].total;
  }
}
