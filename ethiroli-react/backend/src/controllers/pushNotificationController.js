import DeviceRegistration from '../models/DeviceRegistration.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success, error } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';
import { registerDeviceToken, testPushNotification as sendTestPush, sendCampaign as dispatchCampaign } from '../services/fcmService.js';

export const registerDevice = asyncHandler(async (req, res) => {
  const result = await registerDeviceToken({
    userId: req.user.id,
    tenantId: req.tenant?.id,
    deviceId: req.body.deviceId || req.body.device_id,
    platform: req.body.platform || 'WEB',
    pushToken: req.body.pushToken || req.body.push_token || req.body.device_token,
    appVersion: req.body.appVersion || req.body.app_version || '1.0.0'
  });

  await AuditLog.create({
    user_id: req.user.id,
    action: 'REGISTER_DEVICE',
    entity_type: 'DEVICE_REGISTRATION',
    entity_id: result.id,
    new_value: { platform: req.body.platform, deviceId: req.body.deviceId },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  broadcastToRole('ADMIN', 'device_registered', { id: result.id, userId: req.user.id });
  return success(res, 201, result, 'Device token registered successfully');
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
  const { title, body, target_roles, url } = req.body;
  const result = await dispatchCampaign({
    title,
    body,
    targetRoles: target_roles,
    url: url || '/app'
  });

  await AuditLog.create({
    user_id: req.user.id,
    action: 'SEND_PUSH_CAMPAIGN',
    entity_type: 'PUSH_NOTIFICATION_CAMPAIGN',
    new_value: { title, body, target_roles },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  broadcastToRole('ADMIN', 'push_campaign_sent', { title, target_roles });
  return success(res, 200, result, 'Push notification campaign dispatched');
});

export const testUserPush = asyncHandler(async (req, res) => {
  const result = await sendTestPush(req.user.id);
  return success(res, 200, result, 'Test push notification dispatched');
});
