import crypto from 'crypto';
import pool from '../config/database.js';

export default class AutomationWorkflow {
  static async create({ tenant_id, name, description = null, trigger_type, trigger_config, created_by }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO automation_workflows (id, tenant_id, name, description, trigger_type, trigger_config, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, tenant_id, name, description, trigger_type, JSON.stringify(trigger_config), created_by]
    );
    return id;
  }

  static async list({ tenant_id } = {}) {
    let query = 'SELECT * FROM automation_workflows';
    const values = [];

    if (tenant_id) {
      query += ' WHERE tenant_id = ?';
      values.push(tenant_id);
    }

    const [rows] = await pool.execute(query, values);
    return rows;
  }
}