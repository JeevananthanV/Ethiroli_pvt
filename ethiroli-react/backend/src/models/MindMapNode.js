import crypto from 'crypto';
import pool from '../config/database.js';

export default class MindMapNode {
  static async create({ user_id, project_id = null, parent_id = null, title, content = null, node_type = 'BRANCH', position_x = 0, position_y = 0, color = '#4F46E5' }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO mindmap_nodes (id, user_id, project_id, parent_id, title, content, node_type, position_x, position_y, color)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, user_id, project_id, parent_id, title, content, node_type, position_x, position_y, color]
    );
    return id;
  }

  static async list({ user_id } = {}) {
    let query = 'SELECT * FROM mindmap_nodes';
    const values = [];

    if (user_id) {
      query += ' WHERE user_id = ?';
      values.push(user_id);
    }

    const [rows] = await pool.execute(query, values);
    return rows;
  }
}