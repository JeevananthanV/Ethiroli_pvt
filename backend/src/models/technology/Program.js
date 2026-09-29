import pool from '../../config/database.js';
import crypto from 'crypto';

export default class Program {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      tracks: row.tracks ? JSON.parse(row.tracks) : null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM programs WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async findByCode(code) {
    const [rows] = await pool.execute('SELECT * FROM programs WHERE code = ?', [code]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ code, name, description, duration_days, tracks, final_project }) {
    const id = crypto.randomUUID();
    await pool.execute(
      'INSERT INTO programs (id, code, name, description, duration_days, tracks, final_project) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, code, name, description, duration_days, tracks ? JSON.stringify(tracks) : null, final_project || null]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];
    const fields = ['code', 'name', 'description', 'duration_days', 'tracks', 'final_project'];
    for (const field of fields) {
      if (updates[field] !== undefined) {
        queryParts.push(`${field} = ?`);
        values.push(field === 'tracks' ? JSON.stringify(updates[field]) : updates[field]);
      }
    }
    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE programs SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM programs WHERE id = ?', [id]);
  }

  static async list({ is_active, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM programs WHERE 1=1';
    const values = [];
    if (is_active !== undefined) { query += ' AND is_active = ?'; values.push(is_active); }
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);
    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ is_active } = {}) {
    let query = 'SELECT COUNT(*) as total FROM programs WHERE 1=1';
    const values = [];
    if (is_active !== undefined) { query += ' AND is_active = ?'; values.push(is_active); }
    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
