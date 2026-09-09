import ScheduledReport from '../models/ScheduledReport.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listSchedules = asyncHandler(async (req, res) => {
  const { is_paused, page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [items, countRow] = await Promise.all([
    ScheduledReport.list({ tenant_id: req.tenant?.id, is_paused, limit: parseInt(limit), offset }),
    ScheduledReport.count({ tenant_id: req.tenant?.id, is_paused })
  ]);

  return success(res, 200, items, 'Scheduled reports retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total: countRow,
    totalPages: Math.ceil(countRow / parseInt(limit))
  });
});

export const createSchedule = asyncHandler(async (req, res) => {
  const id = await ScheduledReport.create({ ...req.body, tenant_id: req.tenant?.id });
  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_SCHEDULED_REPORT',
    entity_type: 'SCHEDULED_REPORT',
    entity_id: id,
    new_value: { ...req.body, tenant_id: req.tenant?.id },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'scheduled_report_created', { id });
  return success(res, 201, { id }, 'Report scheduled');
});

export const getSchedule = asyncHandler(async (req, res) => {
  const schedule = await ScheduledReport.findById(req.params.id);
  if (!schedule) throw new NotFoundError('Scheduled report not found');
  return success(res, 200, schedule, 'Scheduled report retrieved');
});

export const updateSchedule = asyncHandler(async (req, res) => {
  const schedule = await ScheduledReport.findById(req.params.id);
  if (!schedule) throw new NotFoundError('Scheduled report not found');
  await ScheduledReport.update(req.params.id, req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_SCHEDULED_REPORT',
    entity_type: 'SCHEDULED_REPORT',
    entity_id: req.params.id,
    old_value: schedule,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'scheduled_report_updated', { id: req.params.id });
  return success(res, 200, null, 'Scheduled report updated');
});

export const runNow = asyncHandler(async (req, res) => {
  const schedule = await ScheduledReport.findById(req.params.id);
  if (!schedule) throw new NotFoundError('Scheduled report not found');
  await AuditLog.create({
    user_id: req.user.id,
    action: 'RUN_SCHEDULED_REPORT',
    entity_type: 'SCHEDULED_REPORT',
    entity_id: req.params.id,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'scheduled_report_run', { id: req.params.id });
  return success(res, 200, null, 'Report run triggered');
});

export const pauseSchedule = asyncHandler(async (req, res) => {
  const schedule = await ScheduledReport.findById(req.params.id);
  if (!schedule) throw new NotFoundError('Scheduled report not found');
  await ScheduledReport.update(req.params.id, { is_paused: true });
  await AuditLog.create({
    user_id: req.user.id,
    action: 'PAUSE_SCHEDULED_REPORT',
    entity_type: 'SCHEDULED_REPORT',
    entity_id: req.params.id,
    old_value: schedule,
    new_value: { is_paused: true },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'scheduled_report_paused', { id: req.params.id });
  return success(res, 200, null, 'Schedule paused');
});
