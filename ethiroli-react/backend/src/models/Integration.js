import crypto from 'crypto';
import pool from '../config/database.js';
import { encrypt, decrypt } from '../config/encryption.js';

export default class Integration {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      config: JSON.parse(decrypt(row.config))
    };
  }

  static async create({ service_name, category, config, is_enabled = false }) {
    const id = crypto.randomUUID();
    const configStr = encrypt(JSON.stringify(config));
    await pool.execute(
      `INSERT INTO integrations (id, service_name, category, config, is_enabled)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE config = ?, is_enabled = ?`,
      [id, service_name, category, configStr, is_enabled, configStr, is_enabled]
    );
    return id;
  }

  static async list() {
    const [rows] = await pool.execute('SELECT * FROM integrations');
    return rows.map(row => this.format(row));
  }
}