import eventTypeService from '../services/eventTypeService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';
import AuditLog from '../models/AuditLog.js';

export const listEventTypes = asyncHandler(async (req, res) => {
  const role = req.user?.role;
  const { for_role } = req.query;

  let types;
  if (for_role || (role !== 'ADMIN' && role !== 'SUPER_ADMIN')) {
    types = await eventTypeService.getTypesForRole(for_role || role);
  } else {
    types = await eventTypeService.getAll(req.query.is_active !== 'false');
  }

  return success(res, 200, types, 'Event types retrieved');
});

export const getEventType = asyncHandler(async (req, res) => {
  const type = await eventTypeService.getById(req.params.id) || await eventTypeService.getByType(req.params.id);
  if (!type) throw new NotFoundError('Event type not found');
  return success(res, 200, type, 'Event type retrieved');
});

export const createEventType = asyncHandler(async (req, res) => {
  const { label, color, icon, default_duration_minutes, allowed_create_roles, allowed_write_roles, notification_target_roles } = req.body;
  if (!label) {
    throw new BadRequestError('Label is required');
  }

  const id = await eventTypeService.create({
    label,
    description: req.body.description || null,
    icon: icon || 'event',
    default_duration_minutes: default_duration_minutes || 30,
    color: color || '#6366f1',
    allowed_create_roles: allowed_create_roles || ['ALL'],
    allowed_write_roles: allowed_write_roles || ['ALL'],
    notification_target_roles: notification_target_roles || ['SELF'],
    is_active: req.body.is_active !== undefined ? req.body.is_active : true,
    sort_order: req.body.sort_order || 0,
  });

  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_EVENT_TYPE',
    entity_type: 'EVENT_TYPE',
    entity_id: id,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  return success(res, 201, { id }, 'Event type created successfully');
});

export const updateEventType = asyncHandler(async (req, res) => {
  const type = await eventTypeService.getById(req.params.id);
  if (!type) throw new NotFoundError('Event type not found');

  await eventTypeService.update(req.params.id, req.body);

  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_EVENT_TYPE',
    entity_type: 'EVENT_TYPE',
    entity_id: req.params.id,
    old_value: type,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  return success(res, 200, null, 'Event type updated successfully');
});

export const deleteEventType = asyncHandler(async (req, res) => {
  const type = await eventTypeService.getById(req.params.id);
  if (!type) throw new NotFoundError('Event type not found');

  await eventTypeService.delete(req.params.id);

  await AuditLog.create({
    user_id: req.user.id,
    action: 'DELETE_EVENT_TYPE',
    entity_type: 'EVENT_TYPE',
    entity_id: req.params.id,
    old_value: type,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  return success(res, 200, null, 'Event type deleted successfully');
});
