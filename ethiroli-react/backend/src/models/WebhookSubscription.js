import crypto from 'crypto';
import pool from '../config/database.js';

export default class WebhookSubscription {
  static async create({ tenant_id, user_id, name, url, events, secret }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO webhook_subscriptions (id, tenant_id, user_id, name, url, events, secret)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, tenant_id, user_id, name, url, JSON.stringify(events), secret]
    );
    return id;
  }

  static async list({ tenant_id } = {}) {
    let query = 'SELECT * FROM webhook_subscriptions';
    const values = [];

    if (tenant_id) {
      query += ' WHERE tenant_id = ?';
      values.push(tenant_id);
    }

    const [rows] = await pool.execute(query, values);
    return rows;
  }
}