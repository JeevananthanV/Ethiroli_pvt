import crypto from 'crypto';
import pool from '../config/database.js';

export default class Workflow {
  static format(row) {
    if (!row) return null;
    return row;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM workflows WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ name, entity_type, description = null, is_active = true }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO workflows (id, name, entity_type, description, is_active) VALUES (?, ?, ?, ?, ?)`,
      [id, name, entity_type, description, is_active]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.name !== undefined) { queryParts.push('name = ?'); values.push(updates.name); }
    if (updates.description !== undefined) { queryParts.push('description = ?'); values.push(updates.description); }
    if (updates.is_active !== undefined) { queryParts.push('is_active = ?'); values.push(updates.is_active); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE workflows SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM workflows WHERE id = ?', [id]);
  }

  static async list({ is_active, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM workflows WHERE 1=1';
    const values = [];

    if (is_active !== undefined) { query += ' AND is_active = ?'; values.push(is_active); }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ is_active } = {}) {
    let query = 'SELECT COUNT(*) as total FROM workflows WHERE 1=1';
    const values = [];

    if (is_active !== undefined) { query += ' AND is_active = ?'; values.push(is_active); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
