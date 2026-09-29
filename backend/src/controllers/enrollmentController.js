import Enrollment from '../models/Enrollment.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole, broadcastToUser } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/errors.js';

/**
 * GET /v1/enrollments - staff-wide enrollment listing with pagination.
 * (Tutor/admin dashboards previously called this endpoint but no route existed.)
 */
export const listAllEnrollments = asyncHandler(async (req, res) => {
  const { course_id, student_id, assigned_by_tutor_id, status, page = 1, limit = 50 } = req.query;
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 50;
  const offset = (pageNum - 1) * limitNum;

  const filters = { course_id, student_id, assigned_by_tutor_id, status, limit: limitNum, offset };
  const [items, total] = await Promise.all([
    Enrollment.list(filters),
    Enrollment.count({ course_id, student_id, assigned_by_tutor_id, status })
  ]);

  res.locals.meta = {
    page: pageNum,
    limit: limitNum,
    total,
    totalPages: limitNum > 0 ? Math.ceil(total / limitNum) : 1
  };

  return success(res, 200, items, 'Enrollments retrieved');
});

export const enrollStudent = asyncHandler(async (req, res) => {
  const student_id = req.user.role === 'STUDENT' ? req.user.id : (req.body.student_id || req.user.id);
  const assigned_by_tutor_id = req.user.role !== 'STUDENT' ? req.user.id : null;
  const { due_date, notes } = req.body;

  await Enrollment.enroll({
    student_id,
    course_id: req.params.courseId,
    assigned_by_tutor_id,
    due_date,
    notes
  });

  await AuditLog.create({
    user_id: req.user.id,
    action: 'ENROLL_STUDENT',
    entity_type: 'ENROLLMENT',
    entity_id: `${student_id}_${req.params.courseId}`,
    new_value: { student_id, course_id: req.params.courseId, assigned_by_tutor_id },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  const eventData = { student_id, course_id: req.params.courseId, assigned_by_tutor_id };
  broadcastToRole('TUTOR', 'student_enrolled', eventData);
  broadcastToUser(student_id, 'student_enrolled', eventData);
  return success(res, 201, null, 'Enrolled successfully');
});

/**
 * Assign one or multiple courses to a student by a tutor/admin.
 * Many-to-many relationship supporting customized course sets per student.
 */
export const assignCourses = asyncHandler(async (req, res) => {
  const assigned_by_tutor_id = req.user.id;
  const { student_id, course_ids, due_date, notes } = req.body;

  if (!course_ids || !Array.isArray(course_ids) || course_ids.length === 0) {
    throw new BadRequestError('course_ids must be a non-empty array of course IDs.');
  }

  const assignedCourses = await Enrollment.assignCourses({
    student_id,
    course_ids,
    assigned_by_tutor_id,
    due_date,
    notes
  });

  await AuditLog.create({
    user_id: req.user.id,
    action: 'ASSIGN_COURSES',
    entity_type: 'ENROLLMENT',
    entity_id: `${student_id}`,
    new_value: { student_id, course_ids, assigned_by_tutor_id, due_date, notes },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  const eventPayload = {
    student_id,
    course_ids,
    assigned_by_tutor_id,
    assigned_by_tutor_name: req.user.full_name || 'Tutor',
    assigned_courses: assignedCourses,
    due_date,
    notes,
    timestamp: new Date().toISOString()
  };

  broadcastToRole('TUTOR', 'student_courses_assigned', eventPayload);
  broadcastToRole('ADMIN', 'student_courses_assigned', eventPayload);
  broadcastToUser(student_id, 'student_courses_assigned', eventPayload);

  return success(res, 201, assignedCourses, 'Courses assigned successfully');
});

/**
 * Retrieve customized list of enrolled courses for a specific student.
 * Students can only view their own courses; Tutors/Admins can view any student's courses.
 */
export const getStudentCourses = asyncHandler(async (req, res) => {
  const studentId = req.params.studentId;

  if (req.user.role === 'STUDENT' && req.user.id !== studentId) {
    throw new ForbiddenError('Access forbidden: You can only view your own enrolled courses.');
  }

  const list = await Enrollment.listByStudentId(studentId, {
    status: req.query.status,
    limit: req.query.limit ? Number(req.query.limit) : 50,
    offset: req.query.offset ? Number(req.query.offset) : 0
  });

  return success(res, 200, list);
});

/**
 * Retrieve courses assigned by the currently authenticated tutor.
 */
export const getTutorAssignedCourses = asyncHandler(async (req, res) => {
  const list = await Enrollment.listByTutorId(req.user.id, {
    status: req.query.status,
    limit: req.query.limit ? Number(req.query.limit) : 50,
    offset: req.query.offset ? Number(req.query.offset) : 0
  });

  return success(res, 200, list);
});

export const getMyEnrollments = asyncHandler(async (req, res) => {
  const list = await Enrollment.listByStudentId(req.user.id, {
    status: req.query.status,
    limit: req.query.limit ? Number(req.query.limit) : 100,
    offset: req.query.offset ? Number(req.query.offset) : 0
  });
  return success(res, 200, list);
});

export const unenroll = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findById(req.params.id);
  if (!enrollment) throw new NotFoundError('Enrollment not found');

  if (req.user.role === 'STUDENT' && enrollment.student_id !== req.user.id) {
    throw new ForbiddenError('Access forbidden: You cannot modify other students enrollments.');
  }

  await Enrollment.delete(req.params.id);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'UNENROLL_STUDENT',
    entity_type: 'ENROLLMENT',
    entity_id: req.params.id,
    old_value: enrollment,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  const unenrollData = { enrollment_id: req.params.id, student_id: enrollment.student_id, course_id: enrollment.course_id };
  broadcastToRole('TUTOR', 'student_unenrolled', unenrollData);
  broadcastToUser(enrollment.student_id, 'student_unenrolled', unenrollData);
  return success(res, 200, null, 'Unenrolled successfully');
});

export const listEnrollments = asyncHandler(async (req, res) => {
  const list = await Enrollment.listByCourseId(req.params.courseId, req.query);
  return success(res, 200, list);
});

export const updateProgress = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findById(req.params.id);
  if (!enrollment) throw new NotFoundError('Enrollment not found');
  await Enrollment.updateProgress(req.params.id, req.body.progress);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_ENROLLMENT_PROGRESS',
    entity_type: 'ENROLLMENT',
    entity_id: req.params.id,
    old_value: enrollment,
    new_value: { progress: req.body.progress },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  const progressData = {
    enrollment_id: req.params.id,
    student_id: enrollment.student_id,
    course_id: enrollment.course_id,
    progress: req.body.progress
  };
  broadcastToRole('TUTOR', 'enrollment_progress_updated', progressData);
  broadcastToUser(enrollment.student_id, 'enrollment_progress_updated', progressData);
  return success(res, 200, null, 'Progress updated');
});
