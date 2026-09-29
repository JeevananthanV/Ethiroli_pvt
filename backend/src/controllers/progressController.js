import CourseProgress from '../models/CourseProgress.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

/**
 * GET /v1/courses/:courseId/curriculum
 *
 * One call returns everything the "Course Modules" experience needs:
 * the module -> lesson tree, per-module and per-course completion, the
 * student's enrollment, any earned certificate and a resume pointer.
 */
export const getCourseCurriculum = asyncHandler(async (req, res) => {
  const curriculum = await CourseProgress.getCurriculum(req.params.courseId, req.user.id);
  if (!curriculum) throw new NotFoundError('Course not found');

  res.locals.meta = { role: req.user.role, viewer: req.user.id };
  return success(res, 200, curriculum, 'Course curriculum retrieved');
});

/**
 * GET /v1/progress/me
 *
 * Aggregated learning progress across every enrolled course.
 */
export const getMyProgress = asyncHandler(async (req, res) => {
  const courses = await CourseProgress.getStudentOverview(req.user.id);

  const totals = courses.reduce(
    (acc, course) => {
      acc.total_lessons += course.total_lessons;
      acc.completed_lessons += course.completed_lessons;
      acc.completed_courses += course.is_complete ? 1 : 0;
      acc.certificates += course.certificate ? 1 : 0;
      return acc;
    },
    { total_lessons: 0, completed_lessons: 0, completed_courses: 0, certificates: 0 }
  );

  res.locals.meta = {
    courses: courses.length,
    ...totals,
    percentage: totals.total_lessons > 0
      ? Math.round((totals.completed_lessons / totals.total_lessons) * 100)
      : 0
  };

  return success(res, 200, courses, 'Learning progress retrieved');
});

/**
 * GET /v1/courses/:courseId/progress
 *
 * Lightweight progress-only view of a single course (no lesson bodies).
 */
export const getCourseProgress = asyncHandler(async (req, res) => {
  const curriculum = await CourseProgress.getCurriculum(req.params.courseId, req.user.id);
  if (!curriculum) throw new NotFoundError('Course not found');

  return success(
    res,
    200,
    {
      course: curriculum.course,
      enrollment: curriculum.enrollment,
      certificate: curriculum.certificate,
      progress: curriculum.progress,
      next_lesson: curriculum.next_lesson,
      modules: curriculum.modules.map((mod) => ({
        id: mod.id,
        title: mod.title,
        module_order: mod.module_order,
        total_lessons: mod.total_lessons,
        completed_lessons: mod.completed_lessons,
        percentage: mod.percentage,
        is_complete: mod.is_complete
      }))
    },
    'Course progress retrieved'
  );
});
