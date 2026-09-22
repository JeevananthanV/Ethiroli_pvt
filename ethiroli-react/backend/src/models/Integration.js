import crypto from 'crypto';
import pool from '../config/database.js';
import { encrypt, decrypt } from '../config/encryption.js';

export default class Integration {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      config: (() => { try { return JSON.parse(decrypt(row.config)); } catch { return null; } })()
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM integrations WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ service_name, category, config, is_enabled = false }) {
    const id = crypto.randomUUID();
    const configStr = encrypt(JSON.stringify(config));
    await pool.execute(
      `INSERT INTO integrations (id, service_name, category, config, is_enabled)
       VALUES (?, ?, ?, ?, ?)`,
      [id, service_name, category, configStr, is_enabled]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.service_name !== undefined) { queryParts.push('service_name = ?'); values.push(updates.service_name); }
    if (updates.category !== undefined) { queryParts.push('category = ?'); values.push(updates.category); }
    if (updates.config !== undefined) { queryParts.push('config = ?'); values.push(encrypt(JSON.stringify(updates.config))); }
    if (updates.is_enabled !== undefined) { queryParts.push('is_enabled = ?'); values.push(updates.is_enabled); }
    if (updates.connection_status !== undefined) { queryParts.push('connection_status = ?'); values.push(updates.connection_status); }
    if (updates.last_synced_at !== undefined) { queryParts.push('last_synced_at = ?'); values.push(updates.last_synced_at); }
    if (updates.sync_log !== undefined) { queryParts.push('sync_log = ?'); values.push(updates.sync_log ? JSON.stringify(updates.sync_log) : null); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE integrations SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM integrations WHERE id = ?', [id]);
  }

  static async list({ category, is_enabled, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM integrations WHERE 1=1';
    const values = [];

    if (category) { query += ' AND category = ?'; values.push(category); }
    if (is_enabled !== undefined) { query += ' AND is_enabled = ?'; values.push(is_enabled); }

    query += ' LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ category, is_enabled } = {}) {
    let query = 'SELECT COUNT(*) as total FROM integrations WHERE 1=1';
    const values = [];

    if (category) { query += ' AND category = ?'; values.push(category); }
    if (is_enabled !== undefined) { query += ' AND is_enabled = ?'; values.push(is_enabled); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }

  static async findByType(serviceName) {
    const [rows] = await pool.execute('SELECT * FROM integrations WHERE service_name = ?', [serviceName]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }
}
