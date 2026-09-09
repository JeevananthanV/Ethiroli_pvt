import AuditLog from '../models/AuditLog.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listLogs = asyncHandler(async (req, res) => {
  const { user_id, action, page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [logs, countRow] = await Promise.all([
    AuditLog.list({ user_id, action, limit: parseInt(limit), offset }),
    AuditLog.count({ user_id, action })
  ]);

  return success(res, 200, logs, 'Audit logs retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total: countRow,
    totalPages: Math.ceil(countRow / parseInt(limit))
  });
});

export const exportLogs = asyncHandler(async (req, res) => {
  const { user_id, action, start_date, end_date } = req.query;
  const logs = await AuditLog.list({ user_id, action, limit: 10000, offset: 0 });
  return success(res, 200, { logs, format: 'json' }, 'Audit logs exported');
});
