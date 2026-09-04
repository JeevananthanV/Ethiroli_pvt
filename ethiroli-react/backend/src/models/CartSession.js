import crypto from 'crypto';
import pool from '../config/database.js';

export default class CartSession {
  static async create({ tenant_id, user_id = null, session_token, items, expires_at }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO cart_sessions (id, tenant_id, user_id, session_token, items, expires_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, tenant_id, user_id, session_token, JSON.stringify(items), expires_at]
    );
    return id;
  }
}