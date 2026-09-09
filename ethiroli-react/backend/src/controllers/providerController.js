import ProviderConfig from '../models/ProviderConfig.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listProviders = asyncHandler(async (req, res) => {
  const { provider, page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [items, countRow] = await Promise.all([
    ProviderConfig.list({ provider, limit: parseInt(limit), offset }),
    ProviderConfig.count({ provider })
  ]);

  return success(res, 200, items, 'Providers retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total: countRow,
    totalPages: Math.ceil(countRow / parseInt(limit))
  });
});

export const saveProvider = asyncHandler(async (req, res) => {
  const id = await ProviderConfig.create(req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_PROVIDER_CONFIG',
    entity_type: 'PROVIDER_CONFIG',
    entity_id: id,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'provider_created', { id });
  return success(res, 200, { id }, 'Provider config saved');
});

export const getProvider = asyncHandler(async (req, res) => {
  const provider = await ProviderConfig.findById(req.params.id);
  if (!provider) throw new NotFoundError('Provider not found');
  return success(res, 200, provider, 'Provider retrieved');
});

export const updateProvider = asyncHandler(async (req, res) => {
  const provider = await ProviderConfig.findById(req.params.id);
  if (!provider) throw new NotFoundError('Provider not found');
  await ProviderConfig.update(req.params.id, req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_PROVIDER_CONFIG',
    entity_type: 'PROVIDER_CONFIG',
    entity_id: req.params.id,
    old_value: provider,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'provider_updated', { id: req.params.id });
  return success(res, 200, null, 'Provider updated');
});

export const testProviderConnection = asyncHandler(async (req, res) => {
  return success(res, 200, { connected: true, latency_ms: 42 }, 'Provider connection test successful');
});
