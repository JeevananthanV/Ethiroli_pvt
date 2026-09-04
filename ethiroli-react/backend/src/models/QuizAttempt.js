import pool from '../config/database.js';

export default class QuizAttempt {
  static async create({ quiz_id, student_id, score, total_questions, time_taken_seconds = 0, answers = null, is_live = false, live_session_id = null }) {
    await pool.execute(
      `INSERT INTO quiz_attempts (quiz_id, student_id, score, total_questions, time_taken_seconds, answers, is_live, live_session_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [quiz_id, student_id, score, total_questions, time_taken_seconds, answers ? JSON.stringify(answers) : null, is_live, live_session_id]
    );
  }

  static async listByStudent(studentId) {
    const [rows] = await pool.execute('SELECT * FROM quiz_attempts WHERE student_id = ?', [studentId]);
    return rows;
  }
}