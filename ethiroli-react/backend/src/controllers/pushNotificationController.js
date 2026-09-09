import DeviceRegistration from '../models/DeviceRegistration.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const registerDevice = asyncHandler(async (req, res) => {
  const id = await DeviceRegistration.create({ ...req.body, tenant_id: req.tenant?.id, user_id: req.user.id });
  await AuditLog.create({
    user_id: req.user.id,
    action: 'REGISTER_DEVICE',
    entity_type: 'DEVICE_REGISTRATION',
    entity_id: id,
    new_value: { ...req.body, tenant_id: req.tenant?.id, user_id: req.user.id },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'device_registered', { id });
  return success(res, 201, { id }, 'Device token registered');
});

export const listDevices = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [items, countRow] = await Promise.all([
    DeviceRegistration.list({ user_id: req.user.id, limit: parseInt(limit), offset }),
    DeviceRegistration.count({ user_id: req.user.id })
  ]);

  return success(res, 200, items, 'Devices retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total: countRow,
    totalPages: Math.ceil(countRow / parseInt(limit))
  });
});

export const unregisterDevice = asyncHandler(async (req, res) => {
  const device = await DeviceRegistration.findById(req.params.id);
  if (!device) throw new NotFoundError('Device not found');
  await DeviceRegistration.delete(req.params.id);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'UNREGISTER_DEVICE',
    entity_type: 'DEVICE_REGISTRATION',
    entity_id: req.params.id,
    old_value: device,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'device_unregistered', { id: req.params.id });
  return success(res, 200, null, 'Device unregistered');
});

export const sendCampaign = asyncHandler(async (req, res) => {
  const { title, body, target_roles } = req.body;
  await AuditLog.create({
    user_id: req.user.id,
    action: 'SEND_PUSH_CAMPAIGN',
    entity_type: 'PUSH_NOTIFICATION_CAMPAIGN',
    new_value: { title, body, target_roles },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'push_campaign_sent', { title, target_roles });
  return success(res, 200, { sent: 0, failed: 0 }, 'Push notification campaign sent');
});
