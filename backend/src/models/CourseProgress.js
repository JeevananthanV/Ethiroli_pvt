import pool from '../config/database.js';
import { decrypt } from '../config/encryption.js';

/**
 * Read-model for the LMS "Course Modules" experience.
 *
 * Everything here is derived from existing tables (modules, lessons,
 * lesson_progress, enrollments, certificates) so no extra write-path is needed:
 *  - module progress  = completed lessons in that module / total lessons
 *  - course progress  = completed lessons in that course / total lessons
 *  - "resume" pointer = first lesson that has not been completed yet
 */
export default class CourseProgress {
  /**
   * Full module -> lesson tree for one course, annotated with the requesting
   * student's completion state. When `studentId` is null (tutor/admin preview)
   * every lesson is reported as not completed and `enrollment` is null.
   */
  static async getCurriculum(courseId, studentId = null) {
    const [courseRows] = await pool.execute(
      `SELECT id, code, name, description, duration_days, fee, tutor_id, is_active
         FROM courses WHERE id = ?`,
      [courseId]
    );
    if (courseRows.length === 0) return null;
    const course = courseRows[0];

    const [moduleRows] = await pool.execute(
      `SELECT id, course_id, title, description, duration_minutes, module_order
         FROM modules
        WHERE course_id = ?
        ORDER BY module_order ASC`,
      [courseId]
    );

    const [lessonRows] = await pool.execute(
      `SELECT l.id, l.module_id, l.title, l.video_url, l.lesson_order,
              lp.id IS NOT NULL AS is_completed,
              lp.completed_at AS completed_at
         FROM lessons l
         JOIN modules m ON l.module_id = m.id
         LEFT JOIN lesson_progress lp
                ON lp.lesson_id = l.id
               AND lp.student_id = ?
        WHERE m.course_id = ?
        ORDER BY m.module_order ASC, l.lesson_order ASC`,
      [studentId, courseId]
    );

    let enrollment = null;
    if (studentId) {
      const [enrollmentRows] = await pool.execute(
        `SELECT id, progress_percentage, status, enrolled_at, due_date, completed_at, notes
           FROM enrollments
          WHERE student_id = ? AND course_id = ?`,
        [studentId, courseId]
      );
      enrollment = enrollmentRows[0] || null;
    }

    const lessonsByModule = new Map();
    for (const lesson of lessonRows) {
      const normalised = {
        id: lesson.id,
        module_id: lesson.module_id,
        title: lesson.title,
        video_url: lesson.video_url,
        lesson_order: lesson.lesson_order,
        is_completed: Boolean(lesson.is_completed),
        completed_at: lesson.completed_at || null
      };
      if (!lessonsByModule.has(lesson.module_id)) lessonsByModule.set(lesson.module_id, []);
      lessonsByModule.get(lesson.module_id).push(normalised);
    }

    const modules = moduleRows.map((mod) => {
      const lessons = lessonsByModule.get(mod.id) || [];
      const totalLessons = lessons.length;
      const completedLessons = lessons.filter((l) => l.is_completed).length;
      const percentage = totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

      return {
        id: mod.id,
        course_id: mod.course_id,
        title: mod.title,
        description: mod.description || null,
        duration_minutes: mod.duration_minutes ?? null,
        module_order: mod.module_order,
        total_lessons: totalLessons,
        completed_lessons: completedLessons,
        percentage,
        is_complete: totalLessons > 0 && completedLessons === totalLessons,
        lessons
      };
    });

    const totalLessons = modules.reduce((sum, m) => sum + m.total_lessons, 0);
    const completedLessons = modules.reduce((sum, m) => sum + m.completed_lessons, 0);
    const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    const nextLesson = modules
      .flatMap((m) => m.lessons)
      .find((lesson) => !lesson.is_completed) || null;

    let certificate = null;
    if (studentId) {
      const [certificateRows] = await pool.execute(
        `SELECT id, certificate_number, issue_date, is_verified
           FROM certificates
          WHERE student_id = ? AND course_id = ?
          ORDER BY issue_date DESC LIMIT 1`,
        [studentId, courseId]
      );
      certificate = certificateRows[0] || null;
    }

    return {
      course,
      enrollment,
      certificate,
      progress: {
        total_lessons: totalLessons,
        completed_lessons: completedLessons,
        total_modules: modules.length,
        completed_modules: modules.filter((m) => m.is_complete).length,
        percentage,
        is_complete: totalLessons > 0 && completedLessons === totalLessons
      },
      next_lesson: nextLesson,
      modules
    };
  }

  /** Course progress summary for every course a student is enrolled in. */
  static async getStudentOverview(studentId) {
    const [enrollmentRows] = await pool.execute(
      `SELECT e.id AS enrollment_id, e.course_id, e.progress_percentage, e.status,
              e.enrolled_at, e.due_date, e.completed_at, e.assigned_by_tutor_id,
              c.code, c.name, c.description, c.duration_days, c.fee,
              t.full_name AS tutor_name
         FROM enrollments e
         JOIN courses c ON c.id = e.course_id
         LEFT JOIN users t ON t.id = e.assigned_by_tutor_id
        WHERE e.student_id = ?
        ORDER BY e.enrolled_at DESC`,
      [studentId]
    );

    if (enrollmentRows.length === 0) return [];

    const [moduleTotals] = await pool.execute(
      `SELECT m.course_id,
              COUNT(DISTINCT m.id) AS total_modules,
              COUNT(l.id) AS total_lessons
         FROM modules m
         LEFT JOIN lessons l ON l.module_id = m.id
        GROUP BY m.course_id`
    );

    const [completedLessonsByCourse] = await pool.execute(
      `SELECT m.course_id, COUNT(DISTINCT lp.lesson_id) AS completed_lessons
         FROM lesson_progress lp
         JOIN lessons l ON lp.lesson_id = l.id
         JOIN modules m ON l.module_id = m.id
        WHERE lp.student_id = ? AND lp.is_completed = TRUE
        GROUP BY m.course_id`,
      [studentId]
    );

    const [completedModulesByCourse] = await pool.execute(
      `SELECT course_id, COUNT(*) AS completed_modules
         FROM (
           SELECT mod.id, mod.course_id,
                  COUNT(l.id) AS total,
                  SUM(CASE WHEN lp.is_completed = TRUE THEN 1 ELSE 0 END) AS done
             FROM modules mod
             LEFT JOIN lessons l ON l.module_id = mod.id
             LEFT JOIN lesson_progress lp
                    ON lp.lesson_id = l.id
                   AND lp.student_id = ?
                    AND lp.is_completed = TRUE
            GROUP BY mod.id, mod.course_id
            HAVING total > 0 AND total = done
         ) completed
        GROUP BY course_id`,
      [studentId]
    );

    const [certificateRows] = await pool.execute(
      `SELECT course_id, id AS certificate_id, certificate_number
         FROM certificates WHERE student_id = ?`,
      [studentId]
    );

    const totalsByCourse = new Map(moduleTotals.map((row) => [row.course_id, row]));
    const completedByCourse = new Map(completedLessonsByCourse.map((row) => [row.course_id, row]));
    const completedModulesByCourseMap = new Map(completedModulesByCourse.map((row) => [row.course_id, row]));
    const certificatesByCourse = new Map(certificateRows.map((row) => [row.course_id, row]));

    return enrollmentRows.map((row) => {
      const totals = totalsByCourse.get(row.course_id) || { total_modules: 0, total_lessons: 0 };
      const completed = completedByCourse.get(row.course_id) || { completed_lessons: 0 };
      const completedModules = completedModulesByCourseMap.get(row.course_id) || { completed_modules: 0 };
      const totalLessons = Number(totals.total_lessons) || 0;
      const completedLessons = Number(completed.completed_lessons) || 0;
      const calculated = totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : Number(row.progress_percentage) || 0;

      return {
        enrollment_id: row.enrollment_id,
        course_id: row.course_id,
        code: row.code,
        name: row.name,
        description: row.description,
        duration_days: row.duration_days,
        fee: row.fee,
        tutor_name: row.tutor_name ? (decrypt(row.tutor_name) || row.tutor_name) : null,
        status: row.status,
        enrolled_at: row.enrolled_at,
        due_date: row.due_date,
        completed_at: row.completed_at,
        total_modules: Number(totals.total_modules) || 0,
        completed_modules: Number(completedModules.completed_modules) || 0,
        total_lessons: totalLessons,
        completed_lessons: completedLessons,
        percentage: calculated,
        is_complete: totalLessons > 0 && completedLessons === totalLessons,
        certificate: certificatesByCourse.get(row.course_id) || null
      };
    });
  }
}
