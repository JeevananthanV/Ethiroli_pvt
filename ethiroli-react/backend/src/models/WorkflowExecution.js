import crypto from 'crypto';
import pool from '../config/database.js';

export default class WorkflowExecution {
  static async create({ workflow_id, tenant_id, entity_id, status = 'PENDING', triggered_by = null }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO workflow_executions (id, workflow_id, tenant_id, entity_id, status, triggered_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, workflow_id, tenant_id, entity_id, status, triggered_by]
    );
    return id;
  }

  static async list({ tenant_id } = {}) {
    let query = 'SELECT * FROM workflow_executions';
    const values = [];

    if (tenant_id) {
      query += ' WHERE tenant_id = ?';
      values.push(tenant_id);
    }

    const [rows] = await pool.execute(query, values);
    return rows;
  }
}