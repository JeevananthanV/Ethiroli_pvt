import CalendarEvent from '../models/CalendarEvent.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listEvents = asyncHandler(async (req, res) => {
  const { start_date, end_date, event_type, created_by, page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [items, countRow] = await Promise.all([
    CalendarEvent.list({ start_date, end_date, event_type, created_by, limit: parseInt(limit), offset }),
    CalendarEvent.count({ start_date, end_date, event_type, created_by })
  ]);

  return success(res, 200, items, 'Calendar events retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total: countRow,
    totalPages: Math.ceil(countRow / parseInt(limit))
  });
});

export const createEvent = asyncHandler(async (req, res) => {
  const id = await CalendarEvent.create({ ...req.body, created_by: req.user.id });
  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_CALENDAR_EVENT',
    entity_type: 'CALENDAR_EVENT',
    entity_id: id,
    new_value: { ...req.body, created_by: req.user.id },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('HR', 'calendar_event_created', { id });
  return success(res, 201, { id }, 'Event created successfully');
});

export const getEvent = asyncHandler(async (req, res) => {
  const event = await CalendarEvent.findById(req.params.id);
  if (!event) throw new NotFoundError('Event not found');
  return success(res, 200, event, 'Event retrieved');
});

export const updateEvent = asyncHandler(async (req, res) => {
  const event = await CalendarEvent.findById(req.params.id);
  if (!event) throw new NotFoundError('Event not found');
  await CalendarEvent.update(req.params.id, req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_CALENDAR_EVENT',
    entity_type: 'CALENDAR_EVENT',
    entity_id: req.params.id,
    old_value: event,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('HR', 'calendar_event_updated', { id: req.params.id });
  return success(res, 200, null, 'Event updated successfully');
});

export const deleteEvent = asyncHandler(async (req, res) => {
  const event = await CalendarEvent.findById(req.params.id);
  if (!event) throw new NotFoundError('Event not found');
  await CalendarEvent.delete(req.params.id);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'DELETE_CALENDAR_EVENT',
    entity_type: 'CALENDAR_EVENT',
    entity_id: req.params.id,
    old_value: event,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('HR', 'calendar_event_deleted', { id: req.params.id });
  return success(res, 200, null, 'Event deleted successfully');
});
