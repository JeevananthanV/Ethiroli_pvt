import crypto from 'crypto';
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
    // Generate the UUID in JS: the column defaults to UUID() server-side, which
    // is never surfaced back through `insertId`, so the caller would otherwise
    // receive a meaningless `result.info` string.
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO assignments (id, course_id, title, description, due_date, max_score)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, course_id, title, description, due_date, max_score]
    );
    return id;
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

  /**
   * Assignments for every course the learner is enrolled in, annotated with
   * that learner's own submission (grade, feedback, submitted/graded timestamps).
   */
  static async listByStudentId(studentId) {
    const [rows] = await pool.execute(
      `SELECT a.*,
              c.name AS course_name,
              c.code AS course_code,
              s.id AS submission_id,
              s.file_url AS submission_file_url,
              s.text_content AS submission_text_content,
              s.grade, s.feedback, s.submitted_at, s.graded_at
         FROM assignments a
         JOIN courses c ON c.id = a.course_id
         LEFT JOIN assignment_submissions s
                ON s.assignment_id = a.id
               AND s.student_id = ?
        WHERE a.course_id IN (SELECT course_id FROM enrollments WHERE student_id = ?)
        ORDER BY a.due_date IS NULL, a.due_date ASC, a.created_at DESC`,
      [studentId, studentId]
    );
    return rows.map(row => this.format(row));
  }

  /** Assignments for a set of courses (used for cohort/roster views). */
  static async listByCourseIds(courseIds) {
    if (!Array.isArray(courseIds) || courseIds.length === 0) return [];
    const placeholders = courseIds.map(() => '?').join(', ');
    const [rows] = await pool.execute(
      `SELECT a.*, c.name AS course_name, c.code AS course_code
         FROM assignments a
         JOIN courses c ON c.id = a.course_id
        WHERE a.course_id IN (${placeholders})
        ORDER BY a.due_date IS NULL, a.due_date ASC, a.created_at DESC`,
      courseIds
    );
    return rows.map(row => this.format(row));
  }
}
