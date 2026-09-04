import crypto from 'crypto';
import pool from '../config/database.js';

export default class Coupon {
  static async create({ tenant_id, code, discount_type, discount_value, min_order_value = 0.00, valid_from, valid_to, created_by }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO coupons (id, tenant_id, code, discount_type, discount_value, min_order_value, valid_from, valid_to, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, tenant_id, code, discount_type, discount_value, min_order_value, valid_from, valid_to, created_by]
    );
    return id;
  }

  static async findByCode(tenantId, code) {
    const [rows] = await pool.execute(
      'SELECT * FROM coupons WHERE tenant_id = ? AND code = ? AND is_active = TRUE',
      [tenantId, code]
    );
    return rows.length > 0 ? rows[0] : null;
  }
}