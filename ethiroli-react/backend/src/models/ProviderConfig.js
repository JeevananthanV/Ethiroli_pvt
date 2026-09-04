import crypto from 'crypto';
import pool from '../config/database.js';
import { encrypt, decrypt } from '../config/encryption.js';

export default class ProviderConfig {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      config_value: row.is_encrypted ? decrypt(row.config_value) : row.config_value
    };
  }

  static async create({ provider, config_key, config_value, is_encrypted = true, is_enabled = true }) {
    const id = crypto.randomUUID();
    const val = is_encrypted ? encrypt(config_value) : config_value;
    await pool.execute(
      `INSERT INTO provider_configs (id, provider, config_key, config_value, is_encrypted, is_enabled)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE config_value = ?, is_enabled = ?`,
      [id, provider, config_key, val, is_encrypted, is_enabled, val, is_enabled]
    );
    return id;
  }

  static async list({ provider } = {}) {
    let query = 'SELECT * FROM provider_configs';
    const values = [];

    if (provider) {
      query += ' WHERE provider = ?';
      values.push(provider);
    }

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }
}