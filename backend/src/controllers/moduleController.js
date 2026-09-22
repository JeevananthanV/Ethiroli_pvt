import Module from '../models/Module.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listModules = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId;
  const list = await Module.listByCourseId(courseId);
  return success(res, 200, list, 'Modules retrieved');
});

export const createModule = asyncHandler(async (req, res) => {
  const id = await Module.create({ ...req.body, course_id: req.params.courseId });
  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_MODULE',
    entity_type: 'MODULE',
    entity_id: id,
    new_value: { ...req.body, course_id: req.params.courseId },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('TUTOR', 'module_created', { id });
  return success(res, 201, { id }, 'Module created successfully');
});

export const getModule = asyncHandler(async (req, res) => {
  const mod = await Module.findById(req.params.id);
  if (!mod) throw new NotFoundError('Module not found');
  return success(res, 200, mod, 'Module retrieved');
});

export const updateModule = asyncHandler(async (req, res) => {
  const mod = await Module.findById(req.params.id);
  if (!mod) throw new NotFoundError('Module not found');
  await Module.update(req.params.id, req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_MODULE',
    entity_type: 'MODULE',
    entity_id: req.params.id,
    old_value: mod,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('TUTOR', 'module_updated', { id: req.params.id });
  return success(res, 200, null, 'Module updated successfully');
});

export const deleteModule = asyncHandler(async (req, res) => {
  const mod = await Module.findById(req.params.id);
  if (!mod) throw new NotFoundError('Module not found');
  await Module.delete(req.params.id);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'DELETE_MODULE',
    entity_type: 'MODULE',
    entity_id: req.params.id,
    old_value: mod,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('TUTOR', 'module_deleted', { id: req.params.id });
  return success(res, 200, null, 'Module deleted successfully');
});

export const reorderModules = asyncHandler(async (req, res) => {
  const { moduleIds } = req.body;
  for (let i = 0; i < moduleIds.length; i++) {
    await Module.update(moduleIds[i], { order_index: i + 1 });
  }
  await AuditLog.create({
    user_id: req.user.id,
    action: 'REORDER_MODULES',
    entity_type: 'MODULE',
    new_value: { moduleIds },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('TUTOR', 'modules_reordered', {});
  return success(res, 200, null, 'Modules reordered successfully');
});
