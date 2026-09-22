import pool from '../config/database.js';

export default class Enrollment {
  static format(row) {
    if (!row) return null;
    return row;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM enrollments WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ student_id, course_id }) {
    const [result] = await pool.execute(
      `INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)`,
      [student_id, course_id]
    );
    return result.insertId || result.info;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.progress_percentage !== undefined) { queryParts.push('progress_percentage = ?'); values.push(updates.progress_percentage); }
    if (updates.status !== undefined) { queryParts.push('status = ?'); values.push(updates.status); }
    if (updates.completed_at !== undefined) { queryParts.push('completed_at = ?'); values.push(updates.completed_at); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE enrollments SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM enrollments WHERE id = ?', [id]);
  }

  static async list({ student_id, course_id, status, limit = 50, offset = 0 } = {}) {
    let query = `
      SELECT e.*, c.name as course_name, c.code as course_code, u.full_name as student_name, u.email as student_email 
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      JOIN users u ON e.student_id = u.id
      WHERE 1=1
    `;
    const values = [];

    if (student_id) { query += ' AND e.student_id = ?'; values.push(student_id); }
    if (course_id) { query += ' AND e.course_id = ?'; values.push(course_id); }
    if (status) { query += ' AND e.status = ?'; values.push(status); }

    query += ' ORDER BY e.enrolled_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ student_id, course_id, status } = {}) {
    let query = 'SELECT COUNT(*) as total FROM enrollments WHERE 1=1';
    const values = [];

    if (student_id) { query += ' AND student_id = ?'; values.push(student_id); }
    if (course_id) { query += ' AND course_id = ?'; values.push(course_id); }
    if (status) { query += ' AND status = ?'; values.push(status); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }

  static async enroll({ student_id, course_id }) {
    await pool.execute(
      `INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)`,
      [student_id, course_id]
    );
  }

  static async updateProgress(id, progress) {
    await pool.execute(
      `UPDATE enrollments SET progress_percentage = ? WHERE id = ?`,
      [progress, id]
    );
  }

  static async listByStudentId(studentId) {
    return this.list({ student_id: studentId, limit: 1000 });
  }

  static async listByCourseId(courseId) {
    return this.list({ course_id: courseId, limit: 1000 });
  }
}
