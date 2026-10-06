import StudentProject from '../models/StudentProject.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError, AuthorizationError, ValidationError } from '../utils/errors.js';
import { ROLES } from '../config/constants.js';
import { notifyProjectAssignment } from '../services/projectNotificationService.js';
import {
  readAssignment,
  touchesOwnership,
  buildOwnershipPatch,
  validateOwners,
  fetchAssignableUsers
} from '../services/projectAssignmentService.js';

const privilegedRoles = [ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.PROJECT_MANAGER, ROLES.TUTOR];

const isPrivileged = (req) => privilegedRoles.includes(req.user.role);

const actorOf = (req) => ({
  id: req.user.id,
  role: req.user.role,
  ip: req.ip || req.headers['x-forwarded-for'] || 'unknown',
  userAgent: req.headers['user-agent']
});

/**
 * Active users a project may be handed to. Powers the "Responsible for delivery"
 * picker without exposing the full user directory.
 */
export const listAssignableUsers = asyncHandler(async (req, res) => {
  const users = await fetchAssignableUsers();
  return success(res, 200, users);
});

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
  const assignment = readAssignment(req.body);

  try {
    await validateOwners(assignment.manager_id, assignment.assigned_user_ids);
  } catch (err) {
    throw new ValidationError(err.message);
  }

  const id = await StudentProject.create({
    ...req.body,
    student_id: req.user.id,
    ...assignment
  });

  const project = await StudentProject.findById(id);

  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_STUDENT_PROJECT',
    entity_type: 'STUDENT_PROJECT',
    entity_id: id,
    new_value: { ...req.body, student_id: req.user.id, ...assignment },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  // Connect the project to the people responsible for finishing it.
  notifyProjectAssignment({
    action: 'created',
    project,
    assignedIds: assignment.assigned_user_ids,
    actor: actorOf(req)
  }).catch(() => {});

  // Legacy realtime signal for the student board.
  broadcastToRole('STUDENT', 'student_project_created', { id });

  return success(res, 201, {
    id,
    project,
    notified: {
      manager_id: assignment.manager_id,
      assigned_user_ids: assignment.assigned_user_ids,
      oversight_roles: ['SUPER_ADMIN', 'ADMIN']
    }
  }, 'GitHub repository linked');
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

  const ownershipChanged = touchesOwnership(req.body);
  let assignment = null;

  if (ownershipChanged) {
    // Merge over the stored project so a partial update (e.g. changing only the
    // owner) keeps the existing team instead of clearing it.
    const ownershipPatch = buildOwnershipPatch(req.body);
    assignment = readAssignment({ ...project, ...ownershipPatch });
    try {
      await validateOwners(assignment.manager_id, assignment.assigned_user_ids);
    } catch (err) {
      throw new ValidationError(err.message);
    }
    await StudentProject.update(req.params.id, { ...req.body, ...ownershipPatch });
  } else {
    await StudentProject.update(req.params.id, req.body);
  }

  const updated = await StudentProject.findById(req.params.id);

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

  if (ownershipChanged) {
    const ownerChanged = project.manager_id !== updated.manager_id;
    notifyProjectAssignment({
      action: ownerChanged ? 'reassigned' : 'assigned',
      project: updated,
      assignedIds: updated.assigned_user_ids,
      previousManagerId: ownerChanged ? project.manager_id : null,
      actor: actorOf(req)
    }).catch(() => {});
  }

  broadcastToRole('STUDENT', 'student_project_updated', { id: req.params.id });

  return success(res, 200, {
    project: updated,
    notified: ownershipChanged
      ? {
          manager_id: assignment.manager_id,
          assigned_user_ids: assignment.assigned_user_ids,
          oversight_roles: ['SUPER_ADMIN', 'ADMIN']
        }
      : null
  }, 'Student project updated');
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
