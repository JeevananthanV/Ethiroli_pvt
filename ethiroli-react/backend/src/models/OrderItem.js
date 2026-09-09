import crypto from 'crypto';
import pool from '../config/database.js';

export default class OrderItem {
  static format(row) {
    if (!row) return null;
    return row;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM order_items WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ order_id, product_id, course_id, price_at_purchase, quantity = 1 }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO order_items (id, order_id, product_id, course_id, price_at_purchase, quantity)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, order_id, product_id, course_id, price_at_purchase, quantity]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.quantity !== undefined) { queryParts.push('quantity = ?'); values.push(updates.quantity); }
    if (updates.price_at_purchase !== undefined) { queryParts.push('price_at_purchase = ?'); values.push(updates.price_at_purchase); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE order_items SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM order_items WHERE id = ?', [id]);
  }

  static async list({ order_id, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM order_items WHERE 1=1';
    const values = [];

    if (order_id) { query += ' AND order_id = ?'; values.push(order_id); }

    query += ' LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ order_id } = {}) {
    let query = 'SELECT COUNT(*) as total FROM order_items WHERE 1=1';
    const values = [];

    if (order_id) { query += ' AND order_id = ?'; values.push(order_id); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }

  static async listByOrderId(orderId) {
    return this.list({ order_id: orderId, limit: 1000 });
  }
}
