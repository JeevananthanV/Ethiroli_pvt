import pool from '../config/database.js';

export default class ForumPost {
  static async create({ course_id, author_id, title, content }) {
    await pool.execute(
      'INSERT INTO forum_posts (course_id, author_id, title, content) VALUES (?, ?, ?, ?)',
      [course_id, author_id, title, content]
    );
  }

  static async list({ course_id } = {}) {
    let query = `
      SELECT p.*, u.full_name as author_name 
      FROM forum_posts p
      JOIN users u ON p.author_id = u.id
    `;
    const values = [];

    if (course_id) {
      query += ' WHERE p.course_id = ?';
      values.push(course_id);
    }

    query += ' ORDER BY p.is_pinned DESC, p.created_at DESC';
    const [rows] = await pool.execute(query, values);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM forum_posts WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async updatePin(id, is_pinned) {
    await pool.execute('UPDATE forum_posts SET is_pinned = ? WHERE id = ?', [is_pinned, id]);
  }

  static async updateLock(id, is_locked) {
    await pool.execute('UPDATE forum_posts SET is_locked = ? WHERE id = ?', [is_locked, id]);
  }
}