import pool from '../config/database.js';

export default class Attendance {
  static async list({ user_id, start_date, end_date } = {}) {
    let query = 'SELECT * FROM attendance WHERE 1=1';
    const values = [];

    if (user_id) {
      query += ' AND user_id = ?';
      values.push(user_id);
    }
    if (start_date && end_date) {
      query += ' AND date BETWEEN ? AND ?';
      values.push(start_date, end_date);
    }

    query += ' ORDER BY date DESC';
    const [rows] = await pool.execute(query, values);
    return rows;
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