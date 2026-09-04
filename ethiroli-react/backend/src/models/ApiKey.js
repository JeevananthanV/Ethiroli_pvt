import crypto from 'crypto';
import pool from '../config/database.js';

export default class ApiKey {
  static async create({ tenant_id, user_id, name, api_key, api_secret, scopes = null }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO api_keys (id, tenant_id, user_id, name, api_key, api_secret, scopes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, tenant_id, user_id, name, api_key, api_secret, scopes ? JSON.stringify(scopes) : null]
    );
    return id;
  }

  static async list({ tenant_id } = {}) {
    let query = 'SELECT * FROM api_keys';
    const values = [];

    if (tenant_id) {
      query += ' WHERE tenant_id = ?';
      values.push(tenant_id);
    }

    const [rows] = await pool.execute(query, values);
    return rows;
  }
}