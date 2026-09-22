import ApiKey from '../models/ApiKey.js';
import crypto from 'crypto';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';

export const listApiKeys = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [items, countRow] = await Promise.all([
    ApiKey.list({ tenant_id: req.tenant?.id, limit: parseInt(limit), offset }),
    ApiKey.count({ tenant_id: req.tenant?.id })
  ]);

  return success(res, 200, items, 'API keys retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total: countRow,
    totalPages: Math.ceil(countRow / parseInt(limit))
  });
});

export const createApiKey = asyncHandler(async (req, res) => {
  const key = `ek_${crypto.randomBytes(24).toString('hex')}`;
  const id = await ApiKey.create({
    ...req.body,
    tenant_id: req.tenant?.id,
    user_id: req.user.id,
    key_hash: key
  });
  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_API_KEY',
    entity_type: 'API_KEY',
    entity_id: id,
    new_value: { name: req.body.name },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'api_key_created', { id });
  return success(res, 201, { id, key }, 'API key generated');
});

export const getApiKey = asyncHandler(async (req, res) => {
  const apiKey = await ApiKey.findById(req.params.id);
  if (!apiKey) throw new NotFoundError('API key not found');
  return success(res, 200, apiKey, 'API key retrieved');
});

export const updateApiKey = asyncHandler(async (req, res) => {
  const apiKey = await ApiKey.findById(req.params.id);
  if (!apiKey) throw new NotFoundError('API key not found');
  await ApiKey.update(req.params.id, req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_API_KEY',
    entity_type: 'API_KEY',
    entity_id: req.params.id,
    old_value: apiKey,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'api_key_updated', { id: req.params.id });
  return success(res, 200, null, 'API key updated');
});

export const regenerateApiKey = asyncHandler(async (req, res) => {
  const apiKey = await ApiKey.findById(req.params.id);
  if (!apiKey) throw new NotFoundError('API key not found');
  const newKey = `ek_${crypto.randomBytes(24).toString('hex')}`;
  await ApiKey.update(req.params.id, { key_hash: newKey });
  await AuditLog.create({
    user_id: req.user.id,
    action: 'REGENERATE_API_KEY',
    entity_type: 'API_KEY',
    entity_id: req.params.id,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'api_key_regenerated', { id: req.params.id });
  return success(res, 200, { key: newKey }, 'API key regenerated');
});

export const deleteApiKey = asyncHandler(async (req, res) => {
  const apiKey = await ApiKey.findById(req.params.id);
  if (!apiKey) throw new NotFoundError('API key not found');
  await ApiKey.delete(req.params.id);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'DELETE_API_KEY',
    entity_type: 'API_KEY',
    entity_id: req.params.id,
    old_value: apiKey,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'api_key_deleted', { id: req.params.id });
  return success(res, 200, null, 'API key deleted');
});
