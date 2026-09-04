import crypto from 'crypto';
import pool from '../config/database.js';

export default class Product {
  static async create({ tenant_id, course_id, price, discounted_price = null, is_published = false }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO products (id, tenant_id, course_id, price, discounted_price, is_published)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, tenant_id, course_id, price, discounted_price, is_published]
    );
    return id;
  }

  static async list({ tenant_id } = {}) {
    let query = 'SELECT * FROM products';
    const values = [];

    if (tenant_id) {
      query += ' WHERE tenant_id = ?';
      values.push(tenant_id);
    }

    const [rows] = await pool.execute(query, values);
    return rows;
  }
}