import crypto from 'crypto';
import pool from '../config/database.js';

export default class Intern {
  static format(row) {
    if (!row) return null;
    return row;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM interns WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async findByUserId(userId) {
    const [rows] = await pool.execute('SELECT * FROM interns WHERE user_id = ?', [userId]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ id = crypto.randomUUID(), user_id, mentor_id = null, college_name, stipend = 0, start_date, end_date }) {
    await pool.execute(
      `INSERT INTO interns (id, user_id, mentor_id, college_name, stipend, start_date, end_date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, user_id, mentor_id, college_name, stipend, start_date, end_date]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.mentor_id !== undefined) { queryParts.push('mentor_id = ?'); values.push(updates.mentor_id); }
    if (updates.college_name !== undefined) { queryParts.push('college_name = ?'); values.push(updates.college_name); }
    if (updates.stipend !== undefined) { queryParts.push('stipend = ?'); values.push(updates.stipend); }
    if (updates.start_date !== undefined) { queryParts.push('start_date = ?'); values.push(updates.start_date); }
    if (updates.end_date !== undefined) { queryParts.push('end_date = ?'); values.push(updates.end_date); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE interns SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM interns WHERE id = ?', [id]);
  }

  static async list({ limit = 50, offset = 0 } = {}) {
    const [rows] = await pool.execute(
      `SELECT i.*, u.email, u.full_name, m.full_name as mentor_name 
       FROM interns i
       JOIN users u ON i.user_id = u.id
       LEFT JOIN users m ON i.mentor_id = m.id
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return rows.map(row => this.format(row));
  }

  static async count() {
    const [rows] = await pool.execute('SELECT COUNT(*) as total FROM interns');
    return rows[0].total;
  }
}
