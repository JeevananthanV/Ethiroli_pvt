import crypto from 'crypto';
import pool from '../config/database.js';

export default class Coupon {
  static format(row) {
    if (!row) return null;
    return row;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM coupons WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async findByCode(tenantId, code) {
    const [rows] = await pool.execute(
      'SELECT * FROM coupons WHERE tenant_id = ? AND code = ? AND is_active = TRUE',
      [tenantId, code]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ tenant_id, code, discount_type, discount_value, min_order_value = 0.00, max_discount_amount = null, usage_limit = null, valid_from, valid_to, is_active = true, created_by }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO coupons (id, tenant_id, code, discount_type, discount_value, min_order_value, max_discount_amount, usage_limit, valid_from, valid_to, is_active, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, tenant_id, code, discount_type, discount_value, min_order_value, max_discount_amount, usage_limit, valid_from, valid_to, is_active, created_by]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.code !== undefined) { queryParts.push('code = ?'); values.push(updates.code); }
    if (updates.discount_type !== undefined) { queryParts.push('discount_type = ?'); values.push(updates.discount_type); }
    if (updates.discount_value !== undefined) { queryParts.push('discount_value = ?'); values.push(updates.discount_value); }
    if (updates.min_order_value !== undefined) { queryParts.push('min_order_value = ?'); values.push(updates.min_order_value); }
    if (updates.max_discount_amount !== undefined) { queryParts.push('max_discount_amount = ?'); values.push(updates.max_discount_amount); }
    if (updates.usage_limit !== undefined) { queryParts.push('usage_limit = ?'); values.push(updates.usage_limit); }
    if (updates.used_count !== undefined) { queryParts.push('used_count = ?'); values.push(updates.used_count); }
    if (updates.valid_from !== undefined) { queryParts.push('valid_from = ?'); values.push(updates.valid_from); }
    if (updates.valid_to !== undefined) { queryParts.push('valid_to = ?'); values.push(updates.valid_to); }
    if (updates.is_active !== undefined) { queryParts.push('is_active = ?'); values.push(updates.is_active); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE coupons SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM coupons WHERE id = ?', [id]);
  }

  static async list({ tenant_id, is_active, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM coupons WHERE 1=1';
    const values = [];

    if (tenant_id) { query += ' AND tenant_id = ?'; values.push(tenant_id); }
    if (is_active !== undefined) { query += ' AND is_active = ?'; values.push(is_active); }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ tenant_id, is_active } = {}) {
    let query = 'SELECT COUNT(*) as total FROM coupons WHERE 1=1';
    const values = [];

    if (tenant_id) { query += ' AND tenant_id = ?'; values.push(tenant_id); }
    if (is_active !== undefined) { query += ' AND is_active = ?'; values.push(is_active); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }

  static async incrementUsage(id) {
    await pool.execute('UPDATE coupons SET used_count = used_count + 1 WHERE id = ?', [id]);
  }
}
