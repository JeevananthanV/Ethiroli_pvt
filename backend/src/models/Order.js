import crypto from 'crypto';
import pool from '../config/database.js';

export default class Order {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      billing_address: row.billing_address ? JSON.parse(row.billing_address) : null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM orders WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ tenant_id, user_id = null, order_number, subtotal, discount_amount = 0.00, coupon_code = null, total, customer_name, customer_email, customer_phone = null, billing_address = null, payment_status = 'PENDING', payment_method = 'RAZORPAY', payment_id = null }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO orders (id, tenant_id, user_id, order_number, subtotal, discount_amount, coupon_code, total, customer_name, customer_email, customer_phone, billing_address, payment_status, payment_method, payment_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, tenant_id, user_id, order_number, subtotal, discount_amount, coupon_code, total, customer_name, customer_email, customer_phone, billing_address ? JSON.stringify(billing_address) : null, payment_status, payment_method, payment_id]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.payment_status !== undefined) { queryParts.push('payment_status = ?'); values.push(updates.payment_status); }
    if (updates.payment_method !== undefined) { queryParts.push('payment_method = ?'); values.push(updates.payment_method); }
    if (updates.payment_id !== undefined) { queryParts.push('payment_id = ?'); values.push(updates.payment_id); }
    if (updates.paid_at !== undefined) { queryParts.push('paid_at = ?'); values.push(updates.paid_at); }
    if (updates.subtotal !== undefined) { queryParts.push('subtotal = ?'); values.push(updates.subtotal); }
    if (updates.discount_amount !== undefined) { queryParts.push('discount_amount = ?'); values.push(updates.discount_amount); }
    if (updates.total !== undefined) { queryParts.push('total = ?'); values.push(updates.total); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE orders SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM orders WHERE id = ?', [id]);
  }

  static async list({ tenant_id, user_id, payment_status, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM orders WHERE 1=1';
    const values = [];

    if (tenant_id) { query += ' AND tenant_id = ?'; values.push(tenant_id); }
    if (user_id) { query += ' AND user_id = ?'; values.push(user_id); }
    if (payment_status) { query += ' AND payment_status = ?'; values.push(payment_status); }

    query += ' ORDER BY placed_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ tenant_id, user_id, payment_status } = {}) {
    let query = 'SELECT COUNT(*) as total FROM orders WHERE 1=1';
    const values = [];

    if (tenant_id) { query += ' AND tenant_id = ?'; values.push(tenant_id); }
    if (user_id) { query += ' AND user_id = ?'; values.push(user_id); }
    if (payment_status) { query += ' AND payment_status = ?'; values.push(payment_status); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
