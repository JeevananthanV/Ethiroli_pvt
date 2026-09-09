import ApprovalInstance from '../models/ApprovalInstance.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listInstances = asyncHandler(async (req, res) => {
  const { entity_type, entity_id, status, page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [items, countRow] = await Promise.all([
    ApprovalInstance.list({ entity_type, entity_id, status, limit: parseInt(limit), offset }),
    ApprovalInstance.count({ entity_type, entity_id, status })
  ]);

  return success(res, 200, items, 'Approval instances retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total: countRow,
    totalPages: Math.ceil(countRow / parseInt(limit))
  });
});

export const getInstance = asyncHandler(async (req, res) => {
  const instance = await ApprovalInstance.findById(req.params.id);
  if (!instance) throw new NotFoundError('Approval instance not found');
  return success(res, 200, instance, 'Approval instance retrieved');
});

export const approveInstance = asyncHandler(async (req, res) => {
  const instance = await ApprovalInstance.findById(req.params.id);
  if (!instance) throw new NotFoundError('Approval instance not found');
  await ApprovalInstance.update(req.params.id, { ...req.body, status: 'APPROVED', completed_at: new Date() });
  await AuditLog.create({
    user_id: req.user.id,
    action: 'APPROVE_INSTANCE',
    entity_type: 'APPROVAL_INSTANCE',
    entity_id: req.params.id,
    old_value: instance,
    new_value: { ...req.body, status: 'APPROVED', completed_at: new Date() },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole(req.user.role, 'approval_instance_approved', { id: req.params.id });
  return success(res, 200, null, 'Approval instance approved');
});

export const rejectInstance = asyncHandler(async (req, res) => {
  const instance = await ApprovalInstance.findById(req.params.id);
  if (!instance) throw new NotFoundError('Approval instance not found');
  await ApprovalInstance.update(req.params.id, { ...req.body, status: 'REJECTED', completed_at: new Date() });
  await AuditLog.create({
    user_id: req.user.id,
    action: 'REJECT_INSTANCE',
    entity_type: 'APPROVAL_INSTANCE',
    entity_id: req.params.id,
    old_value: instance,
    new_value: { ...req.body, status: 'REJECTED', completed_at: new Date() },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole(req.user.role, 'approval_instance_rejected', { id: req.params.id });
  return success(res, 200, null, 'Approval instance rejected');
});
