import os from 'node:os';
import SystemConfig from '../models/SystemConfig.js';
import User from '../models/User.js';
import Lead from '../models/Lead.js';
import AuditLog from '../models/AuditLog.js';
import pool, { checkDatabaseHealth, getPoolStats } from '../config/database.js';
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

export const getClusterTelemetry = asyncHandler(async (req, res) => {
  const memUsage = process.memoryUsage();
  const poolHealth = await checkDatabaseHealth(pool);
  const poolStats = await getPoolStats();

  const telemetry = {
    masterPid: process.ppid || process.pid,
    currentWorker: {
      pid: process.pid,
      workerId: process.env.CLUSTER_WORKER_ID || '1',
      clusterMode: process.env.CLUSTER_MODE === 'true',
      memory: {
        rssMb: Math.round(memUsage.rss / 1024 / 1024),
        heapUsedMb: Math.round(memUsage.heapUsed / 1024 / 1024),
        heapTotalMb: Math.round(memUsage.heapTotal / 1024 / 1024)
      },
      uptimeSeconds: Math.round(process.uptime())
    },
    database: {
      connected: poolHealth.connected,
      latencyMs: poolHealth.latencyMs,
      pool: poolStats,
      configuredLimit: Number(process.env.DB_POOL_SIZE || (process.env.CLUSTER_MODE === 'true' ? 10 : 25))
    },
    system: {
      totalMemoryMb: Math.round(os.totalmem() / 1024 / 1024),
      freeMemoryMb: Math.round(os.freemem() / 1024 / 1024),
      cpuCores: os.cpus().length,
      platform: os.platform(),
      nodeVersion: process.version
    },
    timestamp: new Date().toISOString()
  };

  return success(res, 200, telemetry, 'Cluster telemetry retrieved successfully');
});

export const triggerClusterReload = asyncHandler(async (req, res) => {
  const { reason = 'administrative_reload' } = req.body;

  await AuditLog.create({
    user_id: req.user.id,
    action: 'CLUSTER_ROLLING_RELOAD',
    entity_type: 'SYSTEM_CLUSTER',
    new_value: { reason, triggered_by: req.user.id },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  broadcastToRole('SUPER_ADMIN', 'cluster_reload_initiated', {
    reason,
    timestamp: new Date().toISOString()
  });

  // If in cluster mode, signal the parent process for a zero-downtime reload
  try {
    if (process.env.CLUSTER_MODE === 'true' && process.ppid) {
      process.kill(process.ppid, 'SIGUSR2');
    }
  } catch (err) {
    // SIGUSR2 may have Windows limitations if unsupported, gracefully continue
  }

  return success(res, 200, {
    status: 'ROLLING_RELOAD_TRIGGERED',
    reason,
    timestamp: new Date().toISOString()
  }, 'Zero-downtime rolling reload initiated successfully');
});

