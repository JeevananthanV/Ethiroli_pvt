import pool from '../config/database.js';

export default class AssignmentSubmission {
  static format(row) {
    if (!row) return null;
    return row;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM assignment_submissions WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ assignment_id, student_id, file_url = null, text_content = null }) {
    const [result] = await pool.execute(
      `INSERT INTO assignment_submissions (assignment_id, student_id, file_url, text_content)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE file_url = ?, text_content = ?`,
      [assignment_id, student_id, file_url, text_content, file_url, text_content]
    );
    return result.insertId || result.info;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.file_url !== undefined) { queryParts.push('file_url = ?'); values.push(updates.file_url); }
    if (updates.text_content !== undefined) { queryParts.push('text_content = ?'); values.push(updates.text_content); }
    if (updates.grade !== undefined) { queryParts.push('grade = ?'); values.push(updates.grade); }
    if (updates.feedback !== undefined) { queryParts.push('feedback = ?'); values.push(updates.feedback); }
    if (updates.graded_at !== undefined) { queryParts.push('graded_at = ?'); values.push(updates.graded_at); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE assignment_submissions SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM assignment_submissions WHERE id = ?', [id]);
  }

  static async list({ assignment_id, student_id, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM assignment_submissions WHERE 1=1';
    const values = [];

    if (assignment_id) { query += ' AND assignment_id = ?'; values.push(assignment_id); }
    if (student_id) { query += ' AND student_id = ?'; values.push(student_id); }

    query += ' ORDER BY submitted_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ assignment_id, student_id } = {}) {
    let query = 'SELECT COUNT(*) as total FROM assignment_submissions WHERE 1=1';
    const values = [];

    if (assignment_id) { query += ' AND assignment_id = ?'; values.push(assignment_id); }
    if (student_id) { query += ' AND student_id = ?'; values.push(student_id); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }

  static async grade(id, grade, feedback) {
    await pool.execute(
      'UPDATE assignment_submissions SET grade = ?, feedback = ?, graded_at = NOW() WHERE id = ?',
      [grade, feedback, id]
    );
  }

  static async listByAssignment(assignmentId) {
    return this.list({ assignment_id: assignmentId, limit: 1000 });
  }

  static async listByAssignmentId(assignmentId) {
    return this.list({ assignment_id: assignmentId, limit: 1000 });
  }

  static async listByStudentId(studentId) {
    return this.list({ student_id: studentId, limit: 1000 });
  }
}
