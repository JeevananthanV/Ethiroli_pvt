import Course from '../models/Course.js';
import AuditLog from '../models/AuditLog.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listCourses = asyncHandler(async (req, res) => {
  const list = await Course.list({ tutor_id: req.query.tutor_id });
  return success(res, 200, list);
});

export const createCourse = asyncHandler(async (req, res) => {
  const id = await Course.create(req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_COURSE',
    entity_type: 'COURSE',
    entity_id: id,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  return success(res, 201, { id }, 'Course created successfully');
});

export const getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new NotFoundError('Course not found');
  return success(res, 200, course);
});

export const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new NotFoundError('Course not found');
  await Course.update(req.params.id, req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_COURSE',
    entity_type: 'COURSE',
    entity_id: req.params.id,
    old_value: course,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  return success(res, 200, null, 'Course updated successfully');
});

export const publishCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new NotFoundError('Course not found');
  await Course.update(req.params.id, { is_active: true });
  await AuditLog.create({
    user_id: req.user.id,
    action: 'PUBLISH_COURSE',
    entity_type: 'COURSE',
    entity_id: req.params.id,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  return success(res, 200, null, 'Course published');
});

export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new NotFoundError('Course not found');
  await Course.delete(req.params.id);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'DELETE_COURSE',
    entity_type: 'COURSE',
    entity_id: req.params.id,
    old_value: course,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  return success(res, 200, null, 'Course deleted successfully');
});
