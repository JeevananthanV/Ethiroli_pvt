import crypto from 'crypto';
import pool from '../config/database.js';

export default class TenantUser {
  static async create({ user_id, tenant_id, tenant_role, is_primary = false }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO tenant_users (id, user_id, tenant_id, tenant_role, is_primary)
       VALUES (?, ?, ?, ?, ?)`,
      [id, user_id, tenant_id, tenant_role, is_primary]
    );
    return id;
  }
}