import pool from '../config/database.js';

export default class Quiz {
  static format(row) {
    if (!row) return null;
    return row;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM quizzes WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ course_id, title, description, time_limit_minutes = 10, passing_score = 70, is_published = false }) {
    const [result] = await pool.execute(
      `INSERT INTO quizzes (course_id, title, description, time_limit_minutes, passing_score, is_published)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [course_id, title, description, time_limit_minutes, passing_score, is_published]
    );
    return result.insertId || result.info;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.title !== undefined) { queryParts.push('title = ?'); values.push(updates.title); }
    if (updates.description !== undefined) { queryParts.push('description = ?'); values.push(updates.description); }
    if (updates.time_limit_minutes !== undefined) { queryParts.push('time_limit_minutes = ?'); values.push(updates.time_limit_minutes); }
    if (updates.passing_score !== undefined) { queryParts.push('passing_score = ?'); values.push(updates.passing_score); }
    if (updates.is_published !== undefined) { queryParts.push('is_published = ?'); values.push(updates.is_published); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE quizzes SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM quizzes WHERE id = ?', [id]);
  }

  static async list({ course_id, is_published, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM quizzes WHERE 1=1';
    const values = [];

    if (course_id) { query += ' AND course_id = ?'; values.push(course_id); }
    if (is_published !== undefined) { query += ' AND is_published = ?'; values.push(is_published); }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ course_id, is_published } = {}) {
    let query = 'SELECT COUNT(*) as total FROM quizzes WHERE 1=1';
    const values = [];

    if (course_id) { query += ' AND course_id = ?'; values.push(course_id); }
    if (is_published !== undefined) { query += ' AND is_published = ?'; values.push(is_published); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }

  static async listByCourseId(courseId) {
    return this.list({ course_id: courseId, limit: 1000 });
  }
}
