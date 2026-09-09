import pool from '../config/database.js';

export default class ForumPost {
  static format(row) {
    if (!row) return null;
    return row;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM forum_posts WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ course_id, author_id, title, content, is_pinned = false, is_locked = false }) {
    const [result] = await pool.execute(
      `INSERT INTO forum_posts (course_id, author_id, title, content, is_pinned, is_locked)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [course_id, author_id, title, content, is_pinned, is_locked]
    );
    return result.insertId || result.info;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.title !== undefined) { queryParts.push('title = ?'); values.push(updates.title); }
    if (updates.content !== undefined) { queryParts.push('content = ?'); values.push(updates.content); }
    if (updates.is_pinned !== undefined) { queryParts.push('is_pinned = ?'); values.push(updates.is_pinned); }
    if (updates.is_locked !== undefined) { queryParts.push('is_locked = ?'); values.push(updates.is_locked); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE forum_posts SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM forum_posts WHERE id = ?', [id]);
  }

  static async list({ course_id, limit = 50, offset = 0 } = {}) {
    let query = `
      SELECT p.*, u.full_name as author_name 
      FROM forum_posts p
      JOIN users u ON p.author_id = u.id
      WHERE 1=1
    `;
    const values = [];

    if (course_id) { query += ' AND p.course_id = ?'; values.push(course_id); }

    query += ' ORDER BY p.is_pinned DESC, p.created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ course_id } = {}) {
    let query = 'SELECT COUNT(*) as total FROM forum_posts WHERE 1=1';
    const values = [];

    if (course_id) { query += ' AND course_id = ?'; values.push(course_id); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }

  static async updatePin(id, is_pinned) {
    await pool.execute('UPDATE forum_posts SET is_pinned = ? WHERE id = ?', [is_pinned, id]);
  }

  static async updateLock(id, is_locked) {
    await pool.execute('UPDATE forum_posts SET is_locked = ? WHERE id = ?', [is_locked, id]);
  }
}
