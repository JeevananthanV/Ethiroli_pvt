import pool from '../config/database.js';

export default class Assignment {
  static format(row) {
    if (!row) return null;
    return row;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM assignments WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ course_id, title, description, due_date = null, max_score = 100 }) {
    const [result] = await pool.execute(
      `INSERT INTO assignments (course_id, title, description, due_date, max_score)
       VALUES (?, ?, ?, ?, ?)`,
      [course_id, title, description, due_date, max_score]
    );
    return result.insertId || result.info;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.title !== undefined) { queryParts.push('title = ?'); values.push(updates.title); }
    if (updates.description !== undefined) { queryParts.push('description = ?'); values.push(updates.description); }
    if (updates.due_date !== undefined) { queryParts.push('due_date = ?'); values.push(updates.due_date); }
    if (updates.max_score !== undefined) { queryParts.push('max_score = ?'); values.push(updates.max_score); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE assignments SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM assignments WHERE id = ?', [id]);
  }

  static async list({ course_id, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM assignments WHERE 1=1';
    const values = [];

    if (course_id) { query += ' AND course_id = ?'; values.push(course_id); }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ course_id } = {}) {
    let query = 'SELECT COUNT(*) as total FROM assignments WHERE 1=1';
    const values = [];

    if (course_id) { query += ' AND course_id = ?'; values.push(course_id); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }

  static async listByCourseId(courseId) {
    return this.list({ course_id: courseId, limit: 1000 });
  }

  static async listByStudentId(studentId) {
    const [rows] = await pool.execute(
      `SELECT a.*, s.grade, s.feedback, s.submitted_at
       FROM assignments a
       LEFT JOIN assignment_submissions s ON a.id = s.assignment_id AND s.student_id = ?
       WHERE a.course_id IN (SELECT course_id FROM enrollments WHERE student_id = ?)`,
      [studentId, studentId]
    );
    return rows;
  }
}
