import pool from '../config/database.js';

export default class Intern {
  static async findByUserId(userId) {
    const [rows] = await pool.execute('SELECT * FROM interns WHERE user_id = ?', [userId]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async create({ user_id, mentor_id = null, college_name, stipend = 0, start_date, end_date }) {
    await pool.execute(
      `INSERT INTO interns (user_id, mentor_id, college_name, stipend, start_date, end_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, mentor_id, college_name, stipend, start_date, end_date]
    );
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
    return rows;
  }
}