import crypto from 'crypto';
import pool from '../config/database.js';

export default class MindMapNode {
  static format(row) {
    if (!row) return null;
    return row;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM mindmap_nodes WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ user_id, project_id = null, parent_id = null, title, content = null, node_type = 'BRANCH', position_x = 0.00, position_y = 0.00, color = '#4F46E5', icon = null }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO mindmap_nodes (id, user_id, project_id, parent_id, title, content, node_type, position_x, position_y, color, icon)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, user_id, project_id, parent_id, title, content, node_type, position_x, position_y, color, icon]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.title !== undefined) { queryParts.push('title = ?'); values.push(updates.title); }
    if (updates.content !== undefined) { queryParts.push('content = ?'); values.push(updates.content); }
    if (updates.node_type !== undefined) { queryParts.push('node_type = ?'); values.push(updates.node_type); }
    if (updates.position_x !== undefined) { queryParts.push('position_x = ?'); values.push(updates.position_x); }
    if (updates.position_y !== undefined) { queryParts.push('position_y = ?'); values.push(updates.position_y); }
    if (updates.color !== undefined) { queryParts.push('color = ?'); values.push(updates.color); }
    if (updates.icon !== undefined) { queryParts.push('icon = ?'); values.push(updates.icon); }
    if (updates.parent_id !== undefined) { queryParts.push('parent_id = ?'); values.push(updates.parent_id); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE mindmap_nodes SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM mindmap_nodes WHERE id = ?', [id]);
  }

  static async list({ user_id, project_id, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM mindmap_nodes WHERE 1=1';
    const values = [];

    if (user_id) { query += ' AND user_id = ?'; values.push(user_id); }
    if (project_id) { query += ' AND project_id = ?'; values.push(project_id); }

    query += ' ORDER BY created_at ASC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ user_id, project_id } = {}) {
    let query = 'SELECT COUNT(*) as total FROM mindmap_nodes WHERE 1=1';
    const values = [];

    if (user_id) { query += ' AND user_id = ?'; values.push(user_id); }
    if (project_id) { query += ' AND project_id = ?'; values.push(project_id); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
