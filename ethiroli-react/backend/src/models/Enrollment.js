import pool from '../config/database.js';

export default class Enrollment {
  static async listByStudentId(studentId) {
    const [rows] = await pool.execute(
      `SELECT e.*, c.name as course_name, c.code as course_code 
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       WHERE e.student_id = ?`,
      [studentId]
    );
    return rows;
  }

  static async listByCourseId(courseId) {
    const [rows] = await pool.execute(
      `SELECT e.*, u.full_name as student_name, u.email as student_email 
       FROM enrollments e
       JOIN users u ON e.student_id = u.id
       WHERE e.course_id = ?`,
      [courseId]
    );
    return rows;
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
}