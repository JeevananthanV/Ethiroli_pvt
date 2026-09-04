import crypto from 'crypto';
import pool from '../config/database.js';

export default class Tenant {
  static async create({ name, subdomain, custom_domain = null, logo_url = null, primary_color = '#4F46E5', secondary_color = '#0EA5E9' }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO tenants (id, name, subdomain, custom_domain, logo_url, primary_color, secondary_color)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, name, subdomain, custom_domain, logo_url, primary_color, secondary_color]
    );
    return id;
  }

  static async list() {
    const [rows] = await pool.execute('SELECT * FROM tenants');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM tenants WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  }
}