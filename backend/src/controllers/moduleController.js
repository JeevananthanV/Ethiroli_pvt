import Module from '../models/Module.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole, broadcastToRoom } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';

export const listModules = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId || req.query.course_id;
  if (!courseId) {
    const list = await Module.list({ limit: 100 });
    return success(res, 200, list, 'Modules retrieved');
  }
  const list = await Module.listByCourseId(courseId);
  return success(res, 200, list, 'Modules retrieved');
});

export const createModule = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId || req.body.course_id;
  if (!courseId) {
    throw new BadRequestError('course_id is required');
  }

  let moduleOrder = req.body.module_order || req.body.order;
  if (!moduleOrder) {
    const total = await Module.count({ course_id: courseId });
    moduleOrder = (total + 1) * 10;
  }

  const id = await Module.create({
    course_id: courseId,
    title: req.body.title,
    description: req.body.description || null,
    duration_minutes: req.body.duration_minutes ?? null,
    module_order: moduleOrder
  });

  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_MODULE',
    entity_type: 'MODULE',
    entity_id: id,
    new_value: { ...req.body, course_id: courseId, module_order: moduleOrder },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  broadcastToRole('TUTOR', 'module_created', { id, courseId });
  broadcastToRoom(`course:${courseId}`, 'course_curriculum_updated', { courseId });

  return success(
    res,
    201,
    { id, title: req.body.title, module_order: moduleOrder },
    'Module created successfully'
  );
});

export const getModule = asyncHandler(async (req, res) => {
  const mod = await Module.findById(req.params.id);
  if (!mod) throw new NotFoundError('Module not found');
  return success(res, 200, mod, 'Module retrieved');
});

export const updateModule = asyncHandler(async (req, res) => {
  const mod = await Module.findById(req.params.id);
  if (!mod) throw new NotFoundError('Module not found');

  const updates = {
    title: req.body.title !== undefined ? req.body.title : mod.title,
    description: req.body.description !== undefined ? req.body.description : mod.description,
    duration_minutes: req.body.duration_minutes !== undefined ? req.body.duration_minutes : mod.duration_minutes,
    module_order: req.body.module_order !== undefined ? req.body.module_order : (req.body.order !== undefined ? req.body.order : mod.module_order)
  };

  await Module.update(req.params.id, updates);

  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_MODULE',
    entity_type: 'MODULE',
    entity_id: req.params.id,
    old_value: mod,
    new_value: updates,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  broadcastToRole('TUTOR', 'module_updated', { id: req.params.id });
  broadcastToRoom(`course:${mod.course_id}`, 'course_curriculum_updated', { courseId: mod.course_id });

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
  broadcastToRoom(`course:${mod.course_id}`, 'course_curriculum_updated', { courseId: mod.course_id });

  return success(res, 200, null, 'Module deleted successfully');
});

export const reorderModules = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId || req.body.course_id;
  const moduleIds = req.body.moduleIds || req.body.order;

  if (!courseId || !Array.isArray(moduleIds)) {
    throw new BadRequestError('courseId and moduleIds array are required');
  }

  await Module.reorder(courseId, moduleIds);

  await AuditLog.create({
    user_id: req.user.id,
    action: 'REORDER_MODULES',
    entity_type: 'MODULE',
    new_value: { courseId, moduleIds },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  broadcastToRole('TUTOR', 'modules_reordered', { courseId });
  broadcastToRoom(`course:${courseId}`, 'course_curriculum_updated', { courseId });

  return success(res, 200, null, 'Modules reordered successfully');
});
