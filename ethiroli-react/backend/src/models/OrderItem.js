import crypto from 'crypto';
import pool from '../config/database.js';

export default class OrderItem {
  static async create({ order_id, product_id, course_id, price_at_purchase, quantity = 1 }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO order_items (id, order_id, product_id, course_id, price_at_purchase, quantity)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, order_id, product_id, course_id, price_at_purchase, quantity]
    );
    return id;
  }
}