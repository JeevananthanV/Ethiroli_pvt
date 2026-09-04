import pool from '../config/database.js';

export default class SystemConfig {
  static async get(key) {
    const [rows] = await pool.execute(
      'SELECT * FROM system_configs WHERE config_key = ?',
      [key]
    );
    if (rows.length === 0) return null;
    
    const row = rows[0];
    return typeof row.config_value === 'string' ? JSON.parse(row.config_value) : row.config_value;
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
}
