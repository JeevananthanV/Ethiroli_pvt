import CompanySetting from '../models/CompanySetting.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listSettings = asyncHandler(async (req, res) => {
  const settings = await CompanySetting.list();
  return success(res, 200, settings, 'Company settings retrieved');
});

export const getSetting = asyncHandler(async (req, res) => {
  const setting = await CompanySetting.findById(req.params.id);
  if (!setting) throw new NotFoundError('Company setting not found');
  return success(res, 200, setting, 'Company setting retrieved');
});

export const createSetting = asyncHandler(async (req, res) => {
  const id = await CompanySetting.create(req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_COMPANY_SETTING',
    entity_type: 'COMPANY_SETTING',
    entity_id: id,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'company_setting_created', { id });
  return success(res, 201, { id }, 'Company setting created');
});

export const updateSetting = asyncHandler(async (req, res) => {
  const setting = await CompanySetting.findById(req.params.id);
  if (!setting) throw new NotFoundError('Company setting not found');
  await CompanySetting.update(req.params.id, req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_COMPANY_SETTING',
    entity_type: 'COMPANY_SETTING',
    entity_id: req.params.id,
    old_value: setting,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'company_setting_updated', { id: req.params.id });
  return success(res, 200, null, 'Company setting updated');
});

export const deleteSetting = asyncHandler(async (req, res) => {
  const setting = await CompanySetting.findById(req.params.id);
  if (!setting) throw new NotFoundError('Company setting not found');
  await CompanySetting.delete(req.params.id);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'DELETE_COMPANY_SETTING',
    entity_type: 'COMPANY_SETTING',
    entity_id: req.params.id,
    old_value: setting,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'company_setting_deleted', { id: req.params.id });
  return success(res, 200, null, 'Company setting deleted');
});
