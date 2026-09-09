import Tenant from '../models/Tenant.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listTenants = asyncHandler(async (req, res) => {
  const { is_active, page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [items, countRow] = await Promise.all([
    Tenant.list({ is_active, limit: parseInt(limit), offset }),
    Tenant.count({ is_active })
  ]);

  return success(res, 200, items, 'Tenants retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total: countRow,
    totalPages: Math.ceil(countRow / parseInt(limit))
  });
});

export const createTenant = asyncHandler(async (req, res) => {
  const id = await Tenant.create({
    ...req.body,
    white_label_config: req.body.white_label_config || {}
  });
  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_TENANT',
    entity_type: 'TENANT',
    entity_id: id,
    new_value: { ...req.body, white_label_config: req.body.white_label_config || {} },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('SUPER_ADMIN', 'tenant_created', { id });
  return success(res, 201, { id }, 'Tenant created successfully');
});

export const getTenant = asyncHandler(async (req, res) => {
  const tenant = await Tenant.findById(req.params.id);
  if (!tenant) throw new NotFoundError('Tenant not found');
  return success(res, 200, tenant, 'Tenant retrieved');
});

export const updateTenant = asyncHandler(async (req, res) => {
  const tenant = await Tenant.findById(req.params.id);
  if (!tenant) throw new NotFoundError('Tenant not found');
  await Tenant.update(req.params.id, req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_TENANT',
    entity_type: 'TENANT',
    entity_id: req.params.id,
    old_value: tenant,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('SUPER_ADMIN', 'tenant_updated', { id: req.params.id });
  return success(res, 200, null, 'Tenant updated successfully');
});
