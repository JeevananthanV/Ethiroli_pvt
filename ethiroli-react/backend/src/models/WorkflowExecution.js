import crypto from 'crypto';
import pool from '../config/database.js';

export default class WorkflowExecution {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      execution_context: row.execution_context ? JSON.parse(row.execution_context) : null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM workflow_executions WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ workflow_id, tenant_id, entity_id, status = 'PENDING', triggered_by = null }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO workflow_executions (id, workflow_id, tenant_id, entity_id, status, triggered_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, workflow_id, tenant_id, entity_id, status, triggered_by]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.status !== undefined) { queryParts.push('status = ?'); values.push(updates.status); }
    if (updates.current_node_id !== undefined) { queryParts.push('current_node_id = ?'); values.push(updates.current_node_id); }
    if (updates.execution_context !== undefined) { queryParts.push('execution_context = ?'); values.push(updates.execution_context ? JSON.stringify(updates.execution_context) : null); }
    if (updates.error_message !== undefined) { queryParts.push('error_message = ?'); values.push(updates.error_message); }
    if (updates.started_at !== undefined) { queryParts.push('started_at = ?'); values.push(updates.started_at); }
    if (updates.completed_at !== undefined) { queryParts.push('completed_at = ?'); values.push(updates.completed_at); }
    if (updates.triggered_by !== undefined) { queryParts.push('triggered_by = ?'); values.push(updates.triggered_by); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE workflow_executions SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM workflow_executions WHERE id = ?', [id]);
  }

  static async list({ workflow_id, tenant_id, entity_id, status, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM workflow_executions WHERE 1=1';
    const values = [];

    if (workflow_id) { query += ' AND workflow_id = ?'; values.push(workflow_id); }
    if (tenant_id) { query += ' AND tenant_id = ?'; values.push(tenant_id); }
    if (entity_id) { query += ' AND entity_id = ?'; values.push(entity_id); }
    if (status) { query += ' AND status = ?'; values.push(status); }

    query += ' ORDER BY started_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ workflow_id, tenant_id, entity_id, status } = {}) {
    let query = 'SELECT COUNT(*) as total FROM workflow_executions WHERE 1=1';
    const values = [];

    if (workflow_id) { query += ' AND workflow_id = ?'; values.push(workflow_id); }
    if (tenant_id) { query += ' AND tenant_id = ?'; values.push(tenant_id); }
    if (entity_id) { query += ' AND entity_id = ?'; values.push(entity_id); }
    if (status) { query += ' AND status = ?'; values.push(status); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
