import Task from '../models/Task.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToUser } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';

export const listTasks = asyncHandler(async (req, res) => {
  const assigned_to = req.user.role === 'EMPLOYEE' || req.user.role === 'INTERN' ? req.user.id : req.query.assigned_to;
  const list = await Task.list({ assigned_to, subscription_id: req.query.subscription_id });
  return success(res, 200, list);
});

export const createTask = asyncHandler(async (req, res) => {
  const id = await Task.create(req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_TASK',
    entity_type: 'TASK',
    entity_id: id,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  if (req.body.assigned_to) {
    broadcastToUser(req.body.assigned_to, 'task_assigned', { id, description: req.body.description });
  }
  return success(res, 201, { id }, 'Task created successfully');
});

export const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new NotFoundError('Task not found');
  return success(res, 200, task);
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new NotFoundError('Task not found');
  await Task.update(req.params.id, req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_TASK',
    entity_type: 'TASK',
    entity_id: req.params.id,
    old_value: task,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  return success(res, 200, null, 'Task updated');
});

export const bulkUpdateTasks = asyncHandler(async (req, res) => {
  const { ids, updates } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new ValidationError('No task ids provided for bulk update');
  }
  const results = [];
  for (const id of ids) {
    const task = await Task.findById(id);
    if (task) {
      await Task.update(id, updates);
      await AuditLog.create({
        user_id: req.user.id,
        action: 'BULK_UPDATE_TASK',
        entity_type: 'TASK',
        entity_id: id,
        new_value: updates
      });
      results.push(id);
    }
  }
  return success(res, 200, { updated: results }, 'Tasks updated');
});

export const updateTaskStatus = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new NotFoundError('Task not found');
  await Task.updateStatus(req.params.id, req.body.status);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_TASK_STATUS',
    entity_type: 'TASK',
    entity_id: req.params.id,
    old_value: { status: task.status },
    new_value: { status: req.body.status },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  return success(res, 200, null, 'Task status updated');
});
