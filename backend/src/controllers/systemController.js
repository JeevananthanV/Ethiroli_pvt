import SystemConfig from '../models/SystemConfig.js';
import User from '../models/User.js';
import Lead from '../models/Lead.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';

export const getHealth = (req, res) => {
  return success(res, 200, {
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime()
  }, 'System is healthy');
};

export const updateConfigs = asyncHandler(async (req, res) => {
  const { ALLOWED_ORIGINS } = req.body;

  if (ALLOWED_ORIGINS) {
    if (!Array.isArray(ALLOWED_ORIGINS)) {
      throw new ValidationError('ALLOWED_ORIGINS must be a JSON array of strings.');
    }
    await SystemConfig.set('ALLOWED_ORIGINS', ALLOWED_ORIGINS);
  }

  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_SYSTEM_CONFIG',
    entity_type: 'SYSTEM_CONFIG',
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('SUPER_ADMIN', 'system_config_updated', {});
  return success(res, 200, null, 'System configurations updated successfully');
});

export const getStats = asyncHandler(async (req, res) => {
  const [userCount, leadCount] = await Promise.all([
    User.count(),
    Lead.count()
  ]);

  await AuditLog.create({
    user_id: req.user.id,
    action: 'VIEW_SYSTEM_STATS',
    entity_type: 'SYSTEM',
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  return success(res, 200, {
    users: userCount,
    leads: leadCount,
    uptime: process.uptime()
  }, 'System stats retrieved');
});

export const clearCache = asyncHandler(async (req, res) => {
  await AuditLog.create({
    user_id: req.user.id,
    action: 'CLEAR_CACHE',
    entity_type: 'SYSTEM',
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'cache_cleared', {});
  return success(res, 200, null, 'Cache cleared successfully');
});

export const globalSearch = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) throw new ValidationError('Search query is required');

  const isSales = req.user.role === 'SALES';

  let users = [];
  if (['ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) {
    const allUsers = await User.list({ limit: 100 });
    users = allUsers.filter(u =>
      (u.full_name && u.full_name.toLowerCase().includes(q.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(q.toLowerCase()))
    );
  }

  const allLeads = await Lead.list({
    assigned_to: isSales ? req.user.id : undefined,
    limit: 100
  });
  const leads = allLeads.filter(l =>
    (l.name && l.name.toLowerCase().includes(q.toLowerCase())) ||
    (l.email && l.email.toLowerCase().includes(q.toLowerCase())) ||
    (l.phone && l.phone.includes(q))
  );

  await AuditLog.create({
    user_id: req.user.id,
    action: 'GLOBAL_SEARCH',
    entity_type: 'SYSTEM',
    new_value: { query: q, results_count: users.length + leads.length },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  return success(res, 200, { users, leads }, 'Search results retrieved');
});
