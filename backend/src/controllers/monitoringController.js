import SystemErrorLog from '../models/SystemErrorLog.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listErrorLogs = asyncHandler(async (req, res) => {
  const { severity, is_resolved, page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [items, countRow] = await Promise.all([
    SystemErrorLog.list({ severity, is_resolved, limit: parseInt(limit), offset }),
    SystemErrorLog.count({ severity, is_resolved })
  ]);

  return success(res, 200, items, 'Error logs retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total: countRow,
    totalPages: Math.ceil(countRow / parseInt(limit))
  });
});

export const resolveError = asyncHandler(async (req, res) => {
  const log = await SystemErrorLog.findById(req.params.id);
  if (!log) throw new NotFoundError('Error log not found');
  await SystemErrorLog.resolve(req.params.id, req.body.notes, req.user.id);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'RESOLVE_ERROR_LOG',
    entity_type: 'SYSTEM_ERROR_LOG',
    entity_id: req.params.id,
    old_value: log,
    new_value: { notes: req.body.notes, resolved_by: req.user.id },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'error_log_resolved', { id: req.params.id });
  return success(res, 200, null, 'Error log marked as resolved');
});

export const clearErrorLogs = asyncHandler(async (req, res) => {
  await SystemErrorLog.clear({ older_than: req.body.older_than });
  await AuditLog.create({
    user_id: req.user.id,
    action: 'CLEAR_ERROR_LOGS',
    entity_type: 'SYSTEM_ERROR_LOG',
    new_value: { older_than: req.body.older_than },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'error_logs_cleared', {});
  return success(res, 200, null, 'Error logs cleared');
});

export const getErrorLog = asyncHandler(async (req, res) => {
  const log = await SystemErrorLog.findById(req.params.id);
  if (!log) throw new NotFoundError('Error log not found');
  return success(res, 200, log, 'Error log retrieved');
});
