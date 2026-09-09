import CommunicationTemplate from '../models/CommunicationTemplate.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listTemplates = asyncHandler(async (req, res) => {
  const { channel, page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [items, countRow] = await Promise.all([
    CommunicationTemplate.list({ channel, limit: parseInt(limit), offset }),
    CommunicationTemplate.count({ channel })
  ]);

  return success(res, 200, items, 'Templates retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total: countRow,
    totalPages: Math.ceil(countRow / parseInt(limit))
  });
});

export const createTemplate = asyncHandler(async (req, res) => {
  const id = await CommunicationTemplate.create(req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_COMMUNICATION_TEMPLATE',
    entity_type: 'COMMUNICATION_TEMPLATE',
    entity_id: id,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'communication_template_created', { id });
  return success(res, 201, { id }, 'Template created');
});

export const getTemplate = asyncHandler(async (req, res) => {
  const template = await CommunicationTemplate.findById(req.params.id);
  if (!template) throw new NotFoundError('Template not found');
  return success(res, 200, template, 'Template retrieved');
});

export const updateTemplate = asyncHandler(async (req, res) => {
  const template = await CommunicationTemplate.findById(req.params.id);
  if (!template) throw new NotFoundError('Template not found');
  await CommunicationTemplate.update(req.params.id, req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_COMMUNICATION_TEMPLATE',
    entity_type: 'COMMUNICATION_TEMPLATE',
    entity_id: req.params.id,
    old_value: template,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'communication_template_updated', { id: req.params.id });
  return success(res, 200, null, 'Template updated');
});

export const duplicateTemplate = asyncHandler(async (req, res) => {
  const template = await CommunicationTemplate.findById(req.params.id);
  if (!template) throw new NotFoundError('Template not found');
  const id = await CommunicationTemplate.create({ ...template, name: `${template.name} (Copy)` });
  await AuditLog.create({
    user_id: req.user.id,
    action: 'DUPLICATE_COMMUNICATION_TEMPLATE',
    entity_type: 'COMMUNICATION_TEMPLATE',
    entity_id: id,
    new_value: { ...template, name: `${template.name} (Copy)` },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'communication_template_duplicated', { id });
  return success(res, 201, { id }, 'Template duplicated');
});
