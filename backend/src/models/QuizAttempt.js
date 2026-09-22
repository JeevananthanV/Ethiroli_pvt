import pool from '../config/database.js';

export default class QuizAttempt {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      answers: row.answers ? JSON.parse(row.answers) : null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM quiz_attempts WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ quiz_id, student_id, score, total_questions, time_taken_seconds = 0, answers = null, is_live = false, live_session_id = null }) {
    await pool.execute(
      `INSERT INTO quiz_attempts (quiz_id, student_id, score, total_questions, time_taken_seconds, answers, is_live, live_session_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [quiz_id, student_id, score, total_questions, time_taken_seconds, answers ? JSON.stringify(answers) : null, is_live, live_session_id]
    );
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.score !== undefined) { queryParts.push('score = ?'); values.push(updates.score); }
    if (updates.time_taken_seconds !== undefined) { queryParts.push('time_taken_seconds = ?'); values.push(updates.time_taken_seconds); }
    if (updates.answers !== undefined) { queryParts.push('answers = ?'); values.push(updates.answers ? JSON.stringify(updates.answers) : null); }
    if (updates.is_live !== undefined) { queryParts.push('is_live = ?'); values.push(updates.is_live); }
    if (updates.live_session_id !== undefined) { queryParts.push('live_session_id = ?'); values.push(updates.live_session_id); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE quiz_attempts SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM quiz_attempts WHERE id = ?', [id]);
  }

  static async list({ quiz_id, student_id, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM quiz_attempts WHERE 1=1';
    const values = [];

    if (quiz_id) { query += ' AND quiz_id = ?'; values.push(quiz_id); }
    if (student_id) { query += ' AND student_id = ?'; values.push(student_id); }

    query += ' ORDER BY submitted_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ quiz_id, student_id } = {}) {
    let query = 'SELECT COUNT(*) as total FROM quiz_attempts WHERE 1=1';
    const values = [];

    if (quiz_id) { query += ' AND quiz_id = ?'; values.push(quiz_id); }
    if (student_id) { query += ' AND student_id = ?'; values.push(student_id); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }

  static async listByStudent(studentId) {
    return this.list({ student_id: studentId, limit: 1000 });
  }
}
