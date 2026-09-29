import pool from '../config/database.js';
import crypto from 'crypto';

export default class LessonProgress {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      is_completed: Boolean(row.is_completed)
    };
  }

  static async markComplete(studentId, lessonId) {
    // 1. Find course_id and enrollment_id for this lesson and student
    const [lessonRows] = await pool.execute(
      `SELECT l.id as lesson_id, m.course_id, e.id as enrollment_id
       FROM lessons l
       JOIN modules m ON l.module_id = m.id
       LEFT JOIN enrollments e ON e.course_id = m.course_id AND e.student_id = ?
       WHERE l.id = ?`,
      [studentId, lessonId]
    );

    if (lessonRows.length === 0) return null;

    const { course_id, enrollment_id } = lessonRows[0];
    let effectiveEnrollmentId = enrollment_id;

    // Auto-enroll if not explicitly enrolled
    if (!effectiveEnrollmentId) {
      effectiveEnrollmentId = crypto.randomUUID();
      await pool.execute(
        `INSERT INTO enrollments (id, student_id, course_id, status, progress_percentage)
         VALUES (?, ?, ?, 'ACTIVE', 0.00)`,
        [effectiveEnrollmentId, studentId, course_id]
      );
    }

    const progressId = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO lesson_progress (id, enrollment_id, student_id, lesson_id, status, is_completed, completed_at)
       VALUES (?, ?, ?, ?, 'COMPLETED', TRUE, NOW())
       ON DUPLICATE KEY UPDATE status = 'COMPLETED', is_completed = TRUE, completed_at = NOW()`,
      [progressId, effectiveEnrollmentId, studentId, lessonId]
    );

    // Roll up progress percentage to enrollments table
    const rollup = await this.calculateCourseProgressRollup(studentId, course_id);
    return {
      lesson_id: lessonId,
      status: 'COMPLETED',
      course_id,
      ...rollup
    };
  }

  static async calculateCourseProgressRollup(studentId, courseId) {
    // Total lessons in course
    const [totalRows] = await pool.execute(
      `SELECT COUNT(l.id) as total_lessons
       FROM lessons l
       JOIN modules m ON l.module_id = m.id
       WHERE m.course_id = ?`,
      [courseId]
    );
    const totalLessons = totalRows[0]?.total_lessons || 0;

    // Completed lessons by this student
    const [completedRows] = await pool.execute(
      `SELECT COUNT(lp.id) as completed_lessons
       FROM lesson_progress lp
       JOIN lessons l ON lp.lesson_id = l.id
       JOIN modules m ON l.module_id = m.id
       WHERE lp.student_id = ? AND m.course_id = ? AND lp.is_completed = TRUE`,
      [studentId, courseId]
    );
    const completedLessons = completedRows[0]?.completed_lessons || 0;

    const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    await pool.execute(
      `UPDATE enrollments 
       SET progress_percentage = ?, 
           completed_at = (CASE WHEN ? = 100 THEN NOW() ELSE completed_at END),
           status = (CASE WHEN ? = 100 THEN 'COMPLETED' ELSE status END)
       WHERE student_id = ? AND course_id = ?`,
      [percentage, percentage, percentage, studentId, courseId]
    );

    return { totalLessons, completedLessons, percentage };
  }

  static async getCompletedLessonIds(studentId, courseId) {
    const [rows] = await pool.execute(
      `SELECT lp.lesson_id
       FROM lesson_progress lp
       JOIN lessons l ON lp.lesson_id = l.id
       JOIN modules m ON l.module_id = m.id
       WHERE lp.student_id = ? AND m.course_id = ? AND lp.is_completed = TRUE`,
      [studentId, courseId]
    );
    return rows.map(r => r.lesson_id);
  }

  /** Single-lesson completion lookup for the learner-facing player. */
  static async findByStudentAndLesson(studentId, lessonId) {
    const [rows] = await pool.execute(
      `SELECT id, status, is_completed, completed_at, seconds_watched
         FROM lesson_progress
        WHERE student_id = ? AND lesson_id = ?`,
      [studentId, lessonId]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }
}
