import CalendarEvent from '../models/CalendarEvent.js';
import CalendarEventType from '../models/CalendarEventType.js';
import RecurringRule from '../models/RecurringRule.js';
import AuditLog from '../models/AuditLog.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { ApiError, NotFoundError, ForbiddenError } from '../utils/errors.js';
import NotificationRouter from '../services/notificationRouter.js';
import RecurringEngine from '../services/recurringEngine.js';
import CalendarRoleConfigService from '../services/calendarRoleConfigService.js';
import EventTypeService from '../services/eventTypeService.js';
import logger from '../config/logger.js';

export const listEventTypes = asyncHandler(async (req, res) => {
  // eventTypeService exposes `getAll(isActive)` - there is no `list()`.
  const types = await EventTypeService.getAll(true);
  return success(res, 200, types, 'Event types retrieved');
});

export const listEvents = asyncHandler(async (req, res) => {
  const {
    start_date, end_date, event_type, event_type_id, status,
    created_by, tenant_id, page = 1, limit = 50
  } = req.query;
  const userRole = req.user?.role;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const filters = { start_date, end_date, event_type, event_type_id, status, created_by, tenant_id, role: userRole, limit: parseInt(limit), offset };
  const [items, countRow] = await Promise.all([
    CalendarEvent.list(filters),
    CalendarEvent.count(filters)
  ]);
  return success(res, 200, items, 'Calendar events retrieved', { page: parseInt(page), limit: parseInt(limit), total: countRow, totalPages: Math.ceil(countRow / parseInt(limit)) });
});

export const listExpanded = asyncHandler(async (req, res) => {
  const { start, end, event_type_id, role } = req.query;
  const userRole = req.user?.role;
  const targetRole = role || userRole;
  
  const roleConfig = await CalendarRoleConfigService.getConfigForRole(targetRole);

  const events = await CalendarEvent.listExpanded({
    start_date: start,
    end_date: end,
    event_type_id,
    role: ['SUPER_ADMIN', 'ADMIN'].includes(targetRole) ? null : targetRole,
    userId: req.user?.id,
    userRole: targetRole,
    showOthersEvents: roleConfig?.show_others_events ?? true,
    allowedEventTypes: roleConfig?.event_type_visibility?.length ? roleConfig.event_type_visibility : null
  });
  return success(res, 200, events, 'Expanded calendar events retrieved');
});

export const createEvent = asyncHandler(async (req, res) => {
  const userRole = req.user?.role || 'USER';
  const { event_type, event_type_id, recurrence_rule, ...rest } = req.body;

  const typeKey = event_type_id || event_type;
  let typeConfig = null;
  if (typeKey) {
    typeConfig = await EventTypeService.getByType(typeKey);
    if (!typeConfig) {
      typeConfig = await EventTypeService.getById(typeKey);
    }
  }
  if (!typeConfig) throw new NotFoundError('Event type not found');

  const allowed = typeConfig.allowed_create_roles || [];
  const canCreate = allowed.includes('ALL') || allowed.includes(userRole) || ['SUPER_ADMIN', 'ADMIN'].includes(userRole);
  if (!canCreate) throw new ForbiddenError(`Your role (${userRole}) is not permitted to create '${typeConfig.label}' events`);

  const id = await CalendarEvent.create({
    ...rest,
    event_type: typeConfig.label.toUpperCase().replace(/\s+/g, '_'),
    event_type_id: typeConfig.id,
    created_by: req.user.id,
    tenant_id: req.user?.tenant_id || null,
    role: req.body.role || userRole,
    recurrence_rule
  });

  if (recurrence_rule && recurrence_rule.frequency && recurrence_rule.frequency !== 'NONE') {
    await RecurringEngine.createRule(id, recurrence_rule);
  }

  await AuditLog.create({ user_id: req.user.id, action: 'CREATE_CALENDAR_EVENT', entity_type: 'CALENDAR_EVENT', entity_id: id, new_value: req.body, ip_address: req.ip || 'unknown', user_agent: req.headers['user-agent'] });
  const event = await CalendarEvent.findById(id);
  await NotificationRouter.route('created', event, req.user.id, userRole);
  return success(res, 201, { id, event }, 'Event created successfully');
});

export const getEvent = asyncHandler(async (req, res) => {
  const event = await CalendarEvent.findById(req.params.id);
  if (!event) throw new NotFoundError('Event not found');

  const userRole = req.user?.role;
  const userId = req.user?.id;
  const isAdmin = ['SUPER_ADMIN', 'ADMIN'].includes(userRole);

  if (!isAdmin) {
    const isOwner = event.created_by === userId;
    const isAssigned = Array.isArray(event.assigned_users) && event.assigned_users.includes(userId);

    // HR event protection: only HR, owner, or assigned attendee can view
    const isHrEvent = event.role === 'HR' || ['INTERVIEW', 'LEAVE', 'EVALUATION', 'ONBOARDING'].includes(event.event_type);
    if (isHrEvent && userRole !== 'HR' && !isOwner && !isAssigned) {
      throw new ForbiddenError('Access denied: Confidential HR event');
    }

    // Student event protection: non-students (except instructors/admins) cannot view private student events
    if (event.role === 'STUDENT' && !['STUDENT', 'TUTOR', 'ADMIN', 'SUPER_ADMIN'].includes(userRole) && !isOwner && !isAssigned) {
      throw new ForbiddenError('Access denied: Student confidential event');
    }
  }

  const rule = await RecurringRule.findByEventId(req.params.id);
  return success(res, 200, { ...event, recurrence_rule: rule || event.recurrence_rule }, 'Event retrieved');
});

export const updateEvent = asyncHandler(async (req, res) => {
  const event = await CalendarEvent.findById(req.params.id);
  if (!event) throw new NotFoundError('Event not found');
  const userRole = req.user?.role;
  const isOwner = event.created_by === req.user.id;
  const isAdmin = ['SUPER_ADMIN', 'ADMIN'].includes(userRole);
  if (!isOwner && !isAdmin) {
    const typeConfig = await EventTypeService.getByType(event.event_type_id || event.event_type);
    const writeAllowed = typeConfig?.allowed_write_roles || [];
    if (!writeAllowed.includes('ALL') && !writeAllowed.includes(userRole)) {
      throw new ForbiddenError('Insufficient permissions to update this event');
    }
  }
  await CalendarEvent.update(req.params.id, req.body);
  await AuditLog.create({ user_id: req.user.id, action: 'UPDATE_CALENDAR_EVENT', entity_type: 'CALENDAR_EVENT', entity_id: req.params.id, old_value: event, new_value: req.body, ip_address: req.ip || 'unknown', user_agent: req.headers['user-agent'] });
  const updatedEvent = await CalendarEvent.findById(req.params.id);
  await NotificationRouter.route('updated', updatedEvent, req.user.id, userRole);
  return success(res, 200, null, 'Event updated successfully');
});

export const deleteEvent = asyncHandler(async (req, res) => {
  const event = await CalendarEvent.findById(req.params.id);
  if (!event) throw new NotFoundError('Event not found');
  const userRole = req.user?.role;
  const isOwner = event.created_by === req.user.id;
  const isAdmin = ['SUPER_ADMIN', 'ADMIN'].includes(userRole);
  if (!isOwner && !isAdmin) throw new ForbiddenError('Insufficient permissions to delete this event');
  await CalendarEvent.delete(req.params.id);
  await RecurringRule.deleteByEventId(req.params.id);
  await AuditLog.create({ user_id: req.user.id, action: 'DELETE_CALENDAR_EVENT', entity_type: 'CALENDAR_EVENT', entity_id: req.params.id, old_value: event, ip_address: req.ip || 'unknown', user_agent: req.headers['user-agent'] });
  await NotificationRouter.route('deleted', event, req.user.id, userRole);
  return success(res, 200, null, 'Event deleted successfully');
});

export const createRecurrence = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const event = await CalendarEvent.findById(id);
  if (!event) throw new NotFoundError('Event not found');
  const result = await RecurringEngine.createRule(id, req.body);
  return success(res, 201, result, 'Recurrence rule created');
});

export const getInstances = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const instances = await CalendarEvent.list({ parent_event_id: id, include_children: true, limit: 100 });
  return success(res, 200, instances, 'Recurring instances retrieved');
});

export const skipInstance = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { date } = req.body;
  if (!date) throw new ApiError(400, 'date parameter is required');
  await RecurringEngine.skipInstance(id, date);
  return success(res, 200, null, 'Instance skipped');
});

export const cancelInstance = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await RecurringEngine.cancelInstance(id);
  return success(res, 200, null, 'Instance cancelled');
});

export const getRoleConfig = asyncHandler(async (req, res) => {
  const role = req.query.role || req.user?.role;
  const config = await CalendarRoleConfigService.getConfigForRole(role);
  return success(res, 200, config, 'Role calendar config retrieved');
});

export const updateRoleConfig = asyncHandler(async (req, res) => {
  const { role, ...updates } = req.body;
  const targetRole = role || req.user?.role;
  const config = await CalendarRoleConfigService.upsertConfig(targetRole, updates);
  return success(res, 200, config, 'Role calendar config updated');
});

export const getEventTypeById = asyncHandler(async (req, res) => {
  const type = await EventTypeService.getById(req.params.id);
  if (!type) throw new NotFoundError('Event type not found');
  return success(res, 200, type, 'Event type retrieved');
});

export const getEventTypeConfig = asyncHandler(async (req, res) => {
  const role = req.user?.role;
  const config = await CalendarRoleConfigService.getConfigForRole(role);
  return success(res, 200, config, 'Event type configuration retrieved');
});
