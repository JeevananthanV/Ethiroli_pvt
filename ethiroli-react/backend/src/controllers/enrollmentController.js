import Enrollment from '../models/Enrollment.js';
import AuditLog from '../models/AuditLog.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listEnrollments = asyncHandler(async (req, res) => {
  const list = await Enrollment.listByCourseId(req.params.courseId);
  return success(res, 200, list);
});

export const enrollStudent = asyncHandler(async (req, res) => {
  const student_id = req.user.role === 'STUDENT' ? req.user.id : req.body.student_id;
  await Enrollment.enroll({ student_id, course_id: req.params.courseId });
  await AuditLog.create({
    user_id: req.user.id,
    action: 'ENROLL_STUDENT',
    entity_type: 'ENROLLMENT',
    new_value: { student_id, course_id: req.params.courseId },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  return success(res, 201, null, 'Enrolled successfully');
});

export const getMyEnrollments = asyncHandler(async (req, res) => {
  const list = await Enrollment.listByStudentId(req.user.id);
  return success(res, 200, list);
});

export const unenroll = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findById(req.params.id);
  if (!enrollment) throw new NotFoundError('Enrollment not found');
  await Enrollment.delete(req.params.id);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'UNENROLL_STUDENT',
    entity_type: 'ENROLLMENT',
    entity_id: req.params.id,
    old_value: enrollment
  });
  return success(res, 200, null, 'Unenrolled successfully');
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
    new_value: { progress: req.body.progress },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  return success(res, 200, null, 'Progress updated');
});
