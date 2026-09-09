import crypto from 'crypto';
import pool from '../config/database.js';

export default class Holiday {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      restricted_to: row.restricted_to ? JSON.parse(row.restricted_to) : null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM holidays WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ name, date, is_restricted = false, restricted_to = null }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO holidays (id, name, date, is_restricted, restricted_to) VALUES (?, ?, ?, ?, ?)`,
      [id, name, date, is_restricted, restricted_to ? JSON.stringify(restricted_to) : null]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.name !== undefined) { queryParts.push('name = ?'); values.push(updates.name); }
    if (updates.date !== undefined) { queryParts.push('date = ?'); values.push(updates.date); }
    if (updates.is_restricted !== undefined) { queryParts.push('is_restricted = ?'); values.push(updates.is_restricted); }
    if (updates.restricted_to !== undefined) { queryParts.push('restricted_to = ?'); values.push(updates.restricted_to ? JSON.stringify(updates.restricted_to) : null); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE holidays SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM holidays WHERE id = ?', [id]);
  }

  static async list({ start_date, end_date, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM holidays WHERE 1=1';
    const values = [];

    if (start_date && end_date) { query += ' AND date BETWEEN ? AND ?'; values.push(start_date, end_date); }

    query += ' ORDER BY date ASC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ start_date, end_date } = {}) {
    let query = 'SELECT COUNT(*) as total FROM holidays WHERE 1=1';
    const values = [];

    if (start_date && end_date) { query += ' AND date BETWEEN ? AND ?'; values.push(start_date, end_date); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
