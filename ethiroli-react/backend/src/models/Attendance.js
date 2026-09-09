import pool from '../config/database.js';

export default class Attendance {
  static format(row) {
    if (!row) return null;
    return row;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM attendance WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ user_id, date, check_in_time = null, check_out_time = null, status = 'ABSENT', is_late = false }) {
    await pool.execute(
      `INSERT INTO attendance (user_id, date, check_in_time, check_out_time, status, is_late)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, date, check_in_time, check_out_time, status, is_late]
    );
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.check_in_time !== undefined) { queryParts.push('check_in_time = ?'); values.push(updates.check_in_time); }
    if (updates.check_out_time !== undefined) { queryParts.push('check_out_time = ?'); values.push(updates.check_out_time); }
    if (updates.status !== undefined) { queryParts.push('status = ?'); values.push(updates.status); }
    if (updates.is_late !== undefined) { queryParts.push('is_late = ?'); values.push(updates.is_late); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE attendance SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM attendance WHERE id = ?', [id]);
  }

  static async list({ user_id, start_date, end_date, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM attendance WHERE 1=1';
    const values = [];

    if (user_id) { query += ' AND user_id = ?'; values.push(user_id); }
    if (start_date && end_date) { query += ' AND date BETWEEN ? AND ?'; values.push(start_date, end_date); }

    query += ' ORDER BY date DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ user_id, start_date, end_date } = {}) {
    let query = 'SELECT COUNT(*) as total FROM attendance WHERE 1=1';
    const values = [];

    if (user_id) { query += ' AND user_id = ?'; values.push(user_id); }
    if (start_date && end_date) { query += ' AND date BETWEEN ? AND ?'; values.push(start_date, end_date); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }

  static async checkIn(user_id) {
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date();
    const isLate = now.getHours() >= 9 && now.getMinutes() > 0;

    await pool.execute(
      `INSERT INTO attendance (user_id, date, check_in_time, status, is_late)
       VALUES (?, ?, ?, 'PRESENT', ?)
       ON DUPLICATE KEY UPDATE check_in_time = ?`,
      [user_id, today, now, isLate, now]
    );
  }

  static async checkOut(user_id) {
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date();

    await pool.execute(
      `UPDATE attendance 
       SET check_out_time = ? 
       WHERE user_id = ? AND date = ?`,
      [now, user_id, today]
    );
  }

  static async manualCorrect(id, { check_in_time, check_out_time, status }) {
    await pool.execute(
      `UPDATE attendance 
       SET check_in_time = ?, check_out_time = ?, status = ? 
       WHERE id = ?`,
      [check_in_time, check_out_time, status, id]
    );
  }
}
