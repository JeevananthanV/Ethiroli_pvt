import crypto from 'crypto';
import pool from '../config/database.js';

export default class Order {
  static async create({ tenant_id, user_id = null, order_number, subtotal, discount_amount = 0.00, coupon_code = null, total, customer_name, customer_email, customer_phone = null }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO orders (id, tenant_id, user_id, order_number, subtotal, discount_amount, coupon_code, total, customer_name, customer_email, customer_phone)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, tenant_id, user_id, order_number, subtotal, discount_amount, coupon_code, total, customer_name, customer_email, customer_phone]
    );
    return id;
  }

  static async list({ tenant_id } = {}) {
    let query = 'SELECT * FROM orders';
    const values = [];

    if (tenant_id) {
      query += ' WHERE tenant_id = ?';
      values.push(tenant_id);
    }

    const [rows] = await pool.execute(query, values);
    return rows;
  }
}