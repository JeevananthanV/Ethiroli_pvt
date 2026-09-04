import pool from '../config/database.js';

export default class Assignment {
  static async create({ course_id, title, description, due_date, max_score }) {
    await pool.execute(
      `INSERT INTO assignments (course_id, title, description, due_date, max_score)
       VALUES (?, ?, ?, ?, ?)`,
      [course_id, title, description, due_date, max_score]
    );
  }

  static async listByCourseId(courseId) {
    const [rows] = await pool.execute('SELECT * FROM assignments WHERE course_id = ?', [courseId]);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM assignments WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  }
}