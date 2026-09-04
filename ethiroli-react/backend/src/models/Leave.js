import pool from '../config/database.js';

export default class Leave {
  static async list({ status, user_id } = {}) {
    let query = `
      SELECT l.*, u.full_name, u.email 
      FROM leaves l
      JOIN users u ON l.user_id = u.id
      WHERE 1=1
    `;
    const values = [];

    if (status) {
      query += ' AND l.status = ?';
      values.push(status);
    }
    if (user_id) {
      query += ' AND l.user_id = ?';
      values.push(user_id);
    }

    query += ' ORDER BY l.created_at DESC';
    const [rows] = await pool.execute(query, values);
    return rows;
  }

  static async create({ user_id, leave_type, start_date, end_date, reason }) {
    await pool.execute(
      `INSERT INTO leaves (user_id, leave_type, start_date, end_date, reason)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, leave_type, start_date, end_date, reason]
    );
  }

  static async updateStatus(id, status, approved_by) {
    await pool.execute(
      `UPDATE leaves SET status = ?, approved_by = ? WHERE id = ?`,
      [status, approved_by, id]
    );
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM leaves WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  }
}