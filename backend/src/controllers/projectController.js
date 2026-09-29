import StudentProject from '../models/StudentProject.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError, AuthorizationError } from '../utils/errors.js';
import { ROLES } from '../config/constants.js';

const privilegedRoles = [ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.PROJECT_MANAGER, ROLES.TUTOR];

const isPrivileged = (req) => privilegedRoles.includes(req.user.role);

export const listStudentProjects = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 50 } = req.query;
  const studentId = isPrivileged(req) ? (req.query.student_id || req.user.id) : req.user.id;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [items, countRow] = await Promise.all([
    StudentProject.list({ student_id: studentId, status, limit: parseInt(limit), offset }),
    StudentProject.count({ student_id: studentId, status })
  ]);

  return success(res, 200, items, 'Student projects retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total: countRow,
    totalPages: Math.ceil(countRow / parseInt(limit))
  });
});

export const linkRepository = asyncHandler(async (req, res) => {
  const id = await StudentProject.create({ ...req.body, student_id: req.user.id });
  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_STUDENT_PROJECT',
    entity_type: 'STUDENT_PROJECT',
    entity_id: id,
    new_value: { ...req.body, student_id: req.user.id },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('STUDENT', 'student_project_created', { id });
  return success(res, 201, { id }, 'GitHub repository linked');
});

export const getStudentProject = asyncHandler(async (req, res) => {
  const project = await StudentProject.findById(req.params.id);
  if (!project) throw new NotFoundError('Student project not found');
  if (!isPrivileged(req) && project.student_id !== req.user.id) {
    throw new AuthorizationError('Forbidden. You can only access your own projects.');
  }
  return success(res, 200, project, 'Student project retrieved');
});

export const updateStudentProject = asyncHandler(async (req, res) => {
  const project = await StudentProject.findById(req.params.id);
  if (!project) throw new NotFoundError('Student project not found');
  if (!isPrivileged(req) && project.student_id !== req.user.id) {
    throw new AuthorizationError('Forbidden. You can only update your own projects.');
  }
  await StudentProject.update(req.params.id, req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_STUDENT_PROJECT',
    entity_type: 'STUDENT_PROJECT',
    entity_id: req.params.id,
    old_value: project,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('STUDENT', 'student_project_updated', { id: req.params.id });
  return success(res, 200, null, 'Student project updated');
});

export const deleteStudentProject = asyncHandler(async (req, res) => {
  const project = await StudentProject.findById(req.params.id);
  if (!project) throw new NotFoundError('Student project not found');
  if (!isPrivileged(req) && project.student_id !== req.user.id) {
    throw new AuthorizationError('Forbidden. You can only delete your own projects.');
  }
  await StudentProject.delete(req.params.id);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'DELETE_STUDENT_PROJECT',
    entity_type: 'STUDENT_PROJECT',
    entity_id: req.params.id,
    old_value: project,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('STUDENT', 'student_project_deleted', { id: req.params.id });
  return success(res, 200, null, 'Student project deleted');
});
