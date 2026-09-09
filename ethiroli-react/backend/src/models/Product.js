import crypto from 'crypto';
import pool from '../config/database.js';

export default class Product {
  static format(row) {
    if (!row) return null;
    return row;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM products WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ tenant_id, course_id, price, discounted_price = null, is_published = false, featured = false, seo_title = null, seo_description = null }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO products (id, tenant_id, course_id, price, discounted_price, is_published, featured, seo_title, seo_description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, tenant_id, course_id, price, discounted_price, is_published, featured, seo_title, seo_description]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.price !== undefined) { queryParts.push('price = ?'); values.push(updates.price); }
    if (updates.discounted_price !== undefined) { queryParts.push('discounted_price = ?'); values.push(updates.discounted_price); }
    if (updates.is_published !== undefined) { queryParts.push('is_published = ?'); values.push(updates.is_published); }
    if (updates.featured !== undefined) { queryParts.push('featured = ?'); values.push(updates.featured); }
    if (updates.seo_title !== undefined) { queryParts.push('seo_title = ?'); values.push(updates.seo_title); }
    if (updates.seo_description !== undefined) { queryParts.push('seo_description = ?'); values.push(updates.seo_description); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE products SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM products WHERE id = ?', [id]);
  }

  static async list({ tenant_id, is_published, search, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT p.*, c.name as course_name, c.code as course_code FROM products p JOIN courses c ON p.course_id = c.id WHERE 1=1';
    const values = [];

    if (tenant_id) { query += ' AND p.tenant_id = ?'; values.push(tenant_id); }
    if (is_published !== undefined) { query += ' AND p.is_published = ?'; values.push(is_published); }
    if (search) { query += ' AND c.name LIKE ?'; values.push(`%${search}%`); }

    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ tenant_id, is_published, search } = {}) {
    let query = 'SELECT COUNT(*) as total FROM products p JOIN courses c ON p.course_id = c.id WHERE 1=1';
    const values = [];

    if (tenant_id) { query += ' AND p.tenant_id = ?'; values.push(tenant_id); }
    if (is_published !== undefined) { query += ' AND p.is_published = ?'; values.push(is_published); }
    if (search) { query += ' AND c.name LIKE ?'; values.push(`%${search}%`); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
