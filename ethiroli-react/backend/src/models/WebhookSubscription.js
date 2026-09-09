import crypto from 'crypto';
import pool from '../config/database.js';

export default class WebhookSubscription {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      events: row.events ? JSON.parse(row.events) : null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM webhook_subscriptions WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ tenant_id, user_id, name, url, events, secret, is_active = true }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO webhook_subscriptions (id, tenant_id, user_id, name, url, events, secret, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, tenant_id, user_id, name, url, JSON.stringify(events), secret, is_active]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.name !== undefined) { queryParts.push('name = ?'); values.push(updates.name); }
    if (updates.url !== undefined) { queryParts.push('url = ?'); values.push(updates.url); }
    if (updates.events !== undefined) { queryParts.push('events = ?'); values.push(JSON.stringify(updates.events)); }
    if (updates.secret !== undefined) { queryParts.push('secret = ?'); values.push(updates.secret); }
    if (updates.is_active !== undefined) { queryParts.push('is_active = ?'); values.push(updates.is_active); }
    if (updates.last_delivery_at !== undefined) { queryParts.push('last_delivery_at = ?'); values.push(updates.last_delivery_at); }
    if (updates.last_delivery_status !== undefined) { queryParts.push('last_delivery_status = ?'); values.push(updates.last_delivery_status); }
    if (updates.failure_count !== undefined) { queryParts.push('failure_count = ?'); values.push(updates.failure_count); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE webhook_subscriptions SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM webhook_subscriptions WHERE id = ?', [id]);
  }

  static async list({ tenant_id, user_id, event, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM webhook_subscriptions WHERE 1=1';
    const values = [];

    if (tenant_id) { query += ' AND tenant_id = ?'; values.push(tenant_id); }
    if (user_id) { query += ' AND user_id = ?'; values.push(user_id); }
    if (event) { query += ' AND JSON_CONTAINS(events, ?)'; values.push(JSON.stringify(event)); }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ tenant_id, user_id, event } = {}) {
    let query = 'SELECT COUNT(*) as total FROM webhook_subscriptions WHERE 1=1';
    const values = [];

    if (tenant_id) { query += ' AND tenant_id = ?'; values.push(tenant_id); }
    if (user_id) { query += ' AND user_id = ?'; values.push(user_id); }
    if (event) { query += ' AND JSON_CONTAINS(events, ?)'; values.push(JSON.stringify(event)); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
