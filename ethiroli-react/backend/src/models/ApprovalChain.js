import crypto from 'crypto';
import pool from '../config/database.js';

export default class ApprovalChain {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      approval_condition: row.approval_condition ? JSON.parse(row.approval_condition) : null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM approval_chains WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ workflow_id, step_order, approver_role, approval_condition = null }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO approval_chains (id, workflow_id, step_order, approver_role, approval_condition) VALUES (?, ?, ?, ?, ?)`,
      [id, workflow_id, step_order, approver_role, approval_condition ? JSON.stringify(approval_condition) : null]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.step_order !== undefined) { queryParts.push('step_order = ?'); values.push(updates.step_order); }
    if (updates.approver_role !== undefined) { queryParts.push('approver_role = ?'); values.push(updates.approver_role); }
    if (updates.approval_condition !== undefined) { queryParts.push('approval_condition = ?'); values.push(updates.approval_condition ? JSON.stringify(updates.approval_condition) : null); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE approval_chains SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM approval_chains WHERE id = ?', [id]);
  }

  static async list({ workflow_id, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM approval_chains WHERE 1=1';
    const values = [];

    if (workflow_id) { query += ' AND workflow_id = ?'; values.push(workflow_id); }

    query += ' ORDER BY step_order ASC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ workflow_id } = {}) {
    let query = 'SELECT COUNT(*) as total FROM approval_chains WHERE 1=1';
    const values = [];

    if (workflow_id) { query += ' AND workflow_id = ?'; values.push(workflow_id); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }

  static async listByWorkflowId(workflowId) {
    return this.list({ workflow_id: workflowId, limit: 1000 });
  }
}
