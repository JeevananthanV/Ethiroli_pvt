import crypto from 'crypto';
import pool from '../config/database.js';

export default class WorkflowNode {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      node_config: row.node_config ? JSON.parse(row.node_config) : null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM workflow_nodes WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ workflow_id, node_type, node_config, position_x = 0, position_y = 0, next_node_id = null }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO workflow_nodes (id, workflow_id, node_type, node_config, position_x, position_y, next_node_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, workflow_id, node_type, JSON.stringify(node_config), position_x, position_y, next_node_id]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.node_type !== undefined) { queryParts.push('node_type = ?'); values.push(updates.node_type); }
    if (updates.node_config !== undefined) { queryParts.push('node_config = ?'); values.push(JSON.stringify(updates.node_config)); }
    if (updates.position_x !== undefined) { queryParts.push('position_x = ?'); values.push(updates.position_x); }
    if (updates.position_y !== undefined) { queryParts.push('position_y = ?'); values.push(updates.position_y); }
    if (updates.next_node_id !== undefined) { queryParts.push('next_node_id = ?'); values.push(updates.next_node_id); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE workflow_nodes SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM workflow_nodes WHERE id = ?', [id]);
  }

  static async list({ workflow_id, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM workflow_nodes WHERE 1=1';
    const values = [];

    if (workflow_id) { query += ' AND workflow_id = ?'; values.push(workflow_id); }

    query += ' ORDER BY created_at ASC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ workflow_id } = {}) {
    let query = 'SELECT COUNT(*) as total FROM workflow_nodes WHERE 1=1';
    const values = [];

    if (workflow_id) { query += ' AND workflow_id = ?'; values.push(workflow_id); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }

  static async listByWorkflowId(workflowId) {
    return this.list({ workflow_id: workflowId, limit: 1000 });
  }
}
