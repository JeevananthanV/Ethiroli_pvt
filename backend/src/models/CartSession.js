import crypto from 'crypto';
import pool from '../config/database.js';

export default class CartSession {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      items: row.items ? JSON.parse(row.items) : []
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM cart_sessions WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async getByUserId(userId) {
    const [rows] = await pool.execute(
      'SELECT * FROM cart_sessions WHERE user_id = ? AND expires_at > CURRENT_TIMESTAMP ORDER BY created_at DESC LIMIT 1',
      [userId]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  // cartController historically called `findByUserId` - keep it as the public name.
  static async findByUserId(userId) {
    return this.getByUserId(userId);
  }

  static async getItems(id) {
    const cart = await this.findById(id);
    return cart ? cart.items : [];
  }

  /** Merge a product into the JSON `items` column, refreshing its price. */
  static async addItem(id, productId, quantity = 1) {
    const [rows] = await pool.execute(
      `SELECT p.id, p.course_id, p.price, p.discounted_price, c.name AS course_name
         FROM products p
         LEFT JOIN courses c ON c.id = p.course_id
        WHERE p.id = ?`,
      [productId]
    );
    if (rows.length === 0) throw new Error('Product not found');

    const product = rows[0];
    const cart = await this.findById(id);
    const items = cart ? cart.items : [];
    const price = Number(product.discounted_price ?? product.price ?? 0);
    const existing = items.find((item) => item.product_id === productId);

    if (existing) {
      existing.quantity += Number(quantity) || 1;
      existing.price = price;
    } else {
      items.push({
        product_id: productId,
        course_id: product.course_id,
        title: product.course_name || 'Marketplace item',
        price,
        quantity: Number(quantity) || 1
      });
    }

    await this.update(id, { items });
    return items;
  }

  static async removeItem(id, productId) {
    const cart = await this.findById(id);
    if (!cart) return [];
    const items = cart.items.filter((item) => item.product_id !== productId);
    await this.update(id, { items });
    return items;
  }

  static async clear(id) {
    await this.update(id, { items: [] });
  }

  static async applyCoupon(id, couponCode) {
    await this.update(id, { coupon_code: couponCode });
  }

  static async create({ tenant_id, user_id = null, session_token, items = [], expires_at } = {}) {
    let tenantId = tenant_id;
    if (!tenantId) {
      // The schema makes tenant_id NOT NULL - fall back to the default tenant so
      // a request without a resolved tenant still gets a working cart.
      const [tenants] = await pool.execute('SELECT id FROM tenants ORDER BY created_at LIMIT 1');
      tenantId = tenants[0]?.id;
    }
    const [sessionRows] = await pool.execute('SELECT UUID() AS uuid');
    const id = sessionRows[0].uuid;
    const token = session_token || crypto.randomUUID();
    const expiry = expires_at || new Date(Date.now() + 24 * 60 * 60 * 1000);
    await pool.execute(
      `INSERT INTO cart_sessions (id, tenant_id, user_id, session_token, items, expires_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, tenantId, user_id, token, JSON.stringify(items), expiry]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.items !== undefined) { queryParts.push('items = ?'); values.push(JSON.stringify(updates.items)); }
    if (updates.coupon_code !== undefined) { queryParts.push('coupon_code = ?'); values.push(updates.coupon_code); }
    if (updates.expires_at !== undefined) { queryParts.push('expires_at = ?'); values.push(updates.expires_at); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE cart_sessions SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM cart_sessions WHERE id = ?', [id]);
  }

  static async list({ tenant_id, user_id, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM cart_sessions WHERE 1=1';
    const values = [];

    if (tenant_id) { query += ' AND tenant_id = ?'; values.push(tenant_id); }
    if (user_id) { query += ' AND user_id = ?'; values.push(user_id); }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ tenant_id, user_id } = {}) {
    let query = 'SELECT COUNT(*) as total FROM cart_sessions WHERE 1=1';
    const values = [];

    if (tenant_id) { query += ' AND tenant_id = ?'; values.push(tenant_id); }
    if (user_id) { query += ' AND user_id = ?'; values.push(user_id); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
