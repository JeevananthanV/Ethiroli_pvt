import Holiday from '../models/Holiday.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listHolidays = asyncHandler(async (req, res) => {
  const { year, page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [items, countRow] = await Promise.all([
    Holiday.list({ year, limit: parseInt(limit), offset }),
    Holiday.count({ year })
  ]);

  return success(res, 200, items, 'Holidays retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total: countRow,
    totalPages: Math.ceil(countRow / parseInt(limit))
  });
});

export const createHoliday = asyncHandler(async (req, res) => {
  const id = await Holiday.create(req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_HOLIDAY',
    entity_type: 'HOLIDAY',
    entity_id: id,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('HR', 'holiday_created', { id });
  return success(res, 201, { id }, 'Holiday registered successfully');
});

export const getHoliday = asyncHandler(async (req, res) => {
  const holiday = await Holiday.findById(req.params.id);
  if (!holiday) throw new NotFoundError('Holiday not found');
  return success(res, 200, holiday, 'Holiday retrieved');
});

export const updateHoliday = asyncHandler(async (req, res) => {
  const holiday = await Holiday.findById(req.params.id);
  if (!holiday) throw new NotFoundError('Holiday not found');
  await Holiday.update(req.params.id, req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_HOLIDAY',
    entity_type: 'HOLIDAY',
    entity_id: req.params.id,
    old_value: holiday,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('HR', 'holiday_updated', { id: req.params.id });
  return success(res, 200, null, 'Holiday updated successfully');
});

export const deleteHoliday = asyncHandler(async (req, res) => {
  const holiday = await Holiday.findById(req.params.id);
  if (!holiday) throw new NotFoundError('Holiday not found');
  await Holiday.delete(req.params.id);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'DELETE_HOLIDAY',
    entity_type: 'HOLIDAY',
    entity_id: req.params.id,
    old_value: holiday,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('HR', 'holiday_deleted', { id: req.params.id });
  return success(res, 200, null, 'Holiday deleted successfully');
});
