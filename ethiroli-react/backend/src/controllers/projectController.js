import StudentProject from '../models/StudentProject.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listStudentProjects = asyncHandler(async (req, res) => {
  const { student_id, status, page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [items, countRow] = await Promise.all([
    StudentProject.list({ student_id: student_id || req.user.id, status, limit: parseInt(limit), offset }),
    StudentProject.count({ student_id: student_id || req.user.id, status })
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
  return success(res, 200, project, 'Student project retrieved');
});

export const updateStudentProject = asyncHandler(async (req, res) => {
  const project = await StudentProject.findById(req.params.id);
  if (!project) throw new NotFoundError('Student project not found');
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
