import crypto from 'crypto';
import pool from '../config/database.js';

export default class WorkflowNode {
  static async create({ workflow_id, node_type, node_config, position_x = 0, position_y = 0, next_node_id = null }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO workflow_nodes (id, workflow_id, node_type, node_config, position_x, position_y, next_node_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, workflow_id, node_type, JSON.stringify(node_config), position_x, position_y, next_node_id]
    );
    return id;
  }
}