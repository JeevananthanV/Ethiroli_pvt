import crypto from 'crypto';
import pool from '../config/database.js';

export default class Tenant {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      settings: row.settings ? JSON.parse(row.settings) : null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM tenants WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async findByDomain(domain) {
    const [rows] = await pool.execute(
      'SELECT * FROM tenants WHERE subdomain = ? OR custom_domain = ?',
      [domain, domain]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ name, subdomain, custom_domain = null, logo_url = null, primary_color = '#4F46E5', secondary_color = '#0EA5E9', favicon_url = null, email_from = null, timezone = 'Asia/Kolkata', currency = 'INR', is_active = true }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO tenants (id, name, subdomain, custom_domain, logo_url, primary_color, secondary_color, favicon_url, email_from, timezone, currency, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, subdomain, custom_domain, logo_url, primary_color, secondary_color, favicon_url, email_from, timezone, currency, is_active]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.name !== undefined) { queryParts.push('name = ?'); values.push(updates.name); }
    if (updates.custom_domain !== undefined) { queryParts.push('custom_domain = ?'); values.push(updates.custom_domain); }
    if (updates.logo_url !== undefined) { queryParts.push('logo_url = ?'); values.push(updates.logo_url); }
    if (updates.primary_color !== undefined) { queryParts.push('primary_color = ?'); values.push(updates.primary_color); }
    if (updates.secondary_color !== undefined) { queryParts.push('secondary_color = ?'); values.push(updates.secondary_color); }
    if (updates.favicon_url !== undefined) { queryParts.push('favicon_url = ?'); values.push(updates.favicon_url); }
    if (updates.email_from !== undefined) { queryParts.push('email_from = ?'); values.push(updates.email_from); }
    if (updates.timezone !== undefined) { queryParts.push('timezone = ?'); values.push(updates.timezone); }
    if (updates.currency !== undefined) { queryParts.push('currency = ?'); values.push(updates.currency); }
    if (updates.is_active !== undefined) { queryParts.push('is_active = ?'); values.push(updates.is_active); }
    if (updates.settings !== undefined) { queryParts.push('settings = ?'); values.push(updates.settings ? JSON.stringify(updates.settings) : null); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE tenants SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM tenants WHERE id = ?', [id]);
  }

  static async list({ is_active, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM tenants WHERE 1=1';
    const values = [];

    if (is_active !== undefined) { query += ' AND is_active = ?'; values.push(is_active); }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ is_active } = {}) {
    let query = 'SELECT COUNT(*) as total FROM tenants WHERE 1=1';
    const values = [];

    if (is_active !== undefined) { query += ' AND is_active = ?'; values.push(is_active); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
