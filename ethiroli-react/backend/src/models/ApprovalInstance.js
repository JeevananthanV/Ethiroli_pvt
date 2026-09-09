import crypto from 'crypto';
import pool from '../config/database.js';

export default class ApprovalInstance {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      metadata: row.metadata ? JSON.parse(row.metadata) : null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM approval_instances WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ chain_id, entity_type, entity_id, current_step = 1, status = 'PENDING', initiated_by, metadata = null }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO approval_instances (id, chain_id, entity_type, entity_id, current_step, status, initiated_by, metadata) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, chain_id, entity_type, entity_id, current_step, status, initiated_by, metadata ? JSON.stringify(metadata) : null]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.current_step !== undefined) { queryParts.push('current_step = ?'); values.push(updates.current_step); }
    if (updates.status !== undefined) { queryParts.push('status = ?'); values.push(updates.status); }
    if (updates.metadata !== undefined) { queryParts.push('metadata = ?'); values.push(updates.metadata ? JSON.stringify(updates.metadata) : null); }
    if (updates.completed_at !== undefined) { queryParts.push('completed_at = ?'); values.push(updates.completed_at); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE approval_instances SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM approval_instances WHERE id = ?', [id]);
  }

  static async list({ entity_type, entity_id, status, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM approval_instances WHERE 1=1';
    const values = [];

    if (entity_type) { query += ' AND entity_type = ?'; values.push(entity_type); }
    if (entity_id) { query += ' AND entity_id = ?'; values.push(entity_id); }
    if (status) { query += ' AND status = ?'; values.push(status); }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ entity_type, entity_id, status } = {}) {
    let query = 'SELECT COUNT(*) as total FROM approval_instances WHERE 1=1';
    const values = [];

    if (entity_type) { query += ' AND entity_type = ?'; values.push(entity_type); }
    if (entity_id) { query += ' AND entity_id = ?'; values.push(entity_id); }
    if (status) { query += ' AND status = ?'; values.push(status); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
