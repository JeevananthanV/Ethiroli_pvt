import pool from '../config/database.js';

export default class Quiz {
  static async create({ course_id, title, description, time_limit_minutes, passing_score }) {
    await pool.execute(
      `INSERT INTO quizzes (course_id, title, description, time_limit_minutes, passing_score)
       VALUES (?, ?, ?, ?, ?)`,
      [course_id, title, description, time_limit_minutes, passing_score]
    );
  }

  static async listByCourseId(courseId) {
    const [rows] = await pool.execute('SELECT * FROM quizzes WHERE course_id = ?', [courseId]);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM quizzes WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  }
}