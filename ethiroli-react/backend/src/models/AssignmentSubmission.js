import pool from '../config/database.js';

export default class AssignmentSubmission {
  static async create({ assignment_id, student_id, file_url = null, text_content = null }) {
    await pool.execute(
      `INSERT INTO assignment_submissions (assignment_id, student_id, file_url, text_content)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE file_url = ?, text_content = ?`,
      [assignment_id, student_id, file_url, text_content, file_url, text_content]
    );
  }

  static async grade(id, grade, feedback) {
    await pool.execute(
      'UPDATE assignment_submissions SET grade = ?, feedback = ?, graded_at = NOW() WHERE id = ?',
      [grade, feedback, id]
    );
  }

  static async listByAssignment(assignmentId) {
    const [rows] = await pool.execute('SELECT * FROM assignment_submissions WHERE assignment_id = ?', [assignmentId]);
    return rows;
  }
}