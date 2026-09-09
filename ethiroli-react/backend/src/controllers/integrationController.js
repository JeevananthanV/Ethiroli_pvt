import Integration from '../models/Integration.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listIntegrations = asyncHandler(async (req, res) => {
  const list = await Integration.list();
  return success(res, 200, list, 'Integrations retrieved');
});

export const saveIntegration = asyncHandler(async (req, res) => {
  const id = await Integration.create(req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_INTEGRATION',
    entity_type: 'INTEGRATION',
    entity_id: id,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'integration_created', { id });
  return success(res, 200, { id }, 'Integration settings saved');
});

export const getIntegration = asyncHandler(async (req, res) => {
  const integration = await Integration.findById(req.params.id);
  if (!integration) throw new NotFoundError('Integration not found');
  return success(res, 200, integration, 'Integration retrieved');
});

export const updateIntegration = asyncHandler(async (req, res) => {
  const integration = await Integration.findById(req.params.id);
  if (!integration) throw new NotFoundError('Integration not found');
  await Integration.update(req.params.id, req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_INTEGRATION',
    entity_type: 'INTEGRATION',
    entity_id: req.params.id,
    old_value: integration,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'integration_updated', { id: req.params.id });
  return success(res, 200, null, 'Integration updated successfully');
});

export const deleteIntegration = asyncHandler(async (req, res) => {
  const integration = await Integration.findById(req.params.id);
  if (!integration) throw new NotFoundError('Integration not found');
  await Integration.delete(req.params.id);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'DELETE_INTEGRATION',
    entity_type: 'INTEGRATION',
    entity_id: req.params.id,
    old_value: integration,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'integration_deleted', { id: req.params.id });
  return success(res, 200, null, 'Integration deleted successfully');
});
