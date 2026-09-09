import crypto from 'crypto';
import pool from '../config/database.js';

export default class TenantUser {
  static format(row) {
    if (!row) return null;
    return row;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM tenant_users WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ user_id, tenant_id, tenant_role, is_primary = false }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO tenant_users (id, user_id, tenant_id, tenant_role, is_primary)
       VALUES (?, ?, ?, ?, ?)`,
      [id, user_id, tenant_id, tenant_role, is_primary]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.tenant_role !== undefined) { queryParts.push('tenant_role = ?'); values.push(updates.tenant_role); }
    if (updates.is_primary !== undefined) { queryParts.push('is_primary = ?'); values.push(updates.is_primary); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE tenant_users SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM tenant_users WHERE id = ?', [id]);
  }

  static async list({ tenant_id, user_id, limit = 50, offset = 0 } = {}) {
    let query = `
      SELECT tu.*, u.email, u.full_name, t.name as tenant_name
      FROM tenant_users tu
      JOIN users u ON tu.user_id = u.id
      JOIN tenants t ON tu.tenant_id = t.id
      WHERE 1=1
    `;
    const values = [];

    if (tenant_id) { query += ' AND tu.tenant_id = ?'; values.push(tenant_id); }
    if (user_id) { query += ' AND tu.user_id = ?'; values.push(user_id); }

    query += ' ORDER BY tu.created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ tenant_id, user_id } = {}) {
    let query = 'SELECT COUNT(*) as total FROM tenant_users WHERE 1=1';
    const values = [];

    if (tenant_id) { query += ' AND tenant_id = ?'; values.push(tenant_id); }
    if (user_id) { query += ' AND user_id = ?'; values.push(user_id); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
