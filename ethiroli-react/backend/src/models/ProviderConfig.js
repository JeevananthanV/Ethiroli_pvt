import crypto from 'crypto';
import pool from '../config/database.js';

export default class ProviderConfig {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      config_value: row.is_encrypted ? (() => { try { return JSON.parse(require('../config/encryption.js').decrypt(row.config_value)); } catch { return null; } })() : (typeof row.config_value === 'string' ? JSON.parse(row.config_value) : row.config_value)
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM provider_configs WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async get(provider, configKey) {
    const [rows] = await pool.execute(
      'SELECT * FROM provider_configs WHERE provider = ? AND config_key = ?',
      [provider, configKey]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ provider, config_key, config_value, is_encrypted = true, is_enabled = true }) {
    const id = crypto.randomUUID();
    const { encrypt } = require('../config/encryption.js');
    const val = is_encrypted ? encrypt(typeof config_value === 'string' ? config_value : JSON.stringify(config_value)) : (typeof config_value === 'string' ? config_value : JSON.stringify(config_value));
    await pool.execute(
      `INSERT INTO provider_configs (id, provider, config_key, config_value, is_encrypted, is_enabled)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE config_value = ?, is_enabled = ?`,
      [id, provider, config_key, val, is_encrypted, is_enabled, val, is_enabled]
    );
    return id;
  }

  static async save(provider, config_key, config_value, is_encrypted = true, is_enabled = true) {
    return this.create({ provider, config_key, config_value, is_encrypted, is_enabled });
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];
    const { encrypt } = require('../config/encryption.js');

    if (updates.config_value !== undefined) {
      const val = updates.is_encrypted !== false ? encrypt(typeof updates.config_value === 'string' ? updates.config_value : JSON.stringify(updates.config_value)) : (typeof updates.config_value === 'string' ? updates.config_value : JSON.stringify(updates.config_value));
      queryParts.push('config_value = ?');
      values.push(val);
      queryParts.push('is_encrypted = ?');
      values.push(updates.is_encrypted !== false);
    }
    if (updates.is_enabled !== undefined) { queryParts.push('is_enabled = ?'); values.push(updates.is_enabled); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE provider_configs SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM provider_configs WHERE id = ?', [id]);
  }

  static async list({ provider, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM provider_configs WHERE 1=1';
    const values = [];

    if (provider) { query += ' AND provider = ?'; values.push(provider); }

    query += ' LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ provider } = {}) {
    let query = 'SELECT COUNT(*) as total FROM provider_configs WHERE 1=1';
    const values = [];

    if (provider) { query += ' AND provider = ?'; values.push(provider); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
