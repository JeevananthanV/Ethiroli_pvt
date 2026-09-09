import Workflow from '../models/Workflow.js';
import ApprovalChain from '../models/ApprovalChain.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listWorkflows = asyncHandler(async (req, res) => {
  const { is_active, page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [items, countRow] = await Promise.all([
    Workflow.list({ is_active, limit: parseInt(limit), offset }),
    Workflow.count({ is_active })
  ]);

  return success(res, 200, items, 'Workflows retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total: countRow,
    totalPages: Math.ceil(countRow / parseInt(limit))
  });
});

export const createWorkflow = asyncHandler(async (req, res) => {
  const id = await Workflow.create(req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_WORKFLOW',
    entity_type: 'WORKFLOW',
    entity_id: id,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'workflow_created', { id });
  return success(res, 201, { id }, 'Workflow created successfully');
});

export const getWorkflow = asyncHandler(async (req, res) => {
  const workflow = await Workflow.findById(req.params.id);
  if (!workflow) throw new NotFoundError('Workflow not found');
  return success(res, 200, workflow, 'Workflow retrieved');
});

export const updateWorkflow = asyncHandler(async (req, res) => {
  const workflow = await Workflow.findById(req.params.id);
  if (!workflow) throw new NotFoundError('Workflow not found');
  await Workflow.update(req.params.id, req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_WORKFLOW',
    entity_type: 'WORKFLOW',
    entity_id: req.params.id,
    old_value: workflow,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'workflow_updated', { id: req.params.id });
  return success(res, 200, null, 'Workflow updated successfully');
});

export const deleteWorkflow = asyncHandler(async (req, res) => {
  const workflow = await Workflow.findById(req.params.id);
  if (!workflow) throw new NotFoundError('Workflow not found');
  await Workflow.delete(req.params.id);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'DELETE_WORKFLOW',
    entity_type: 'WORKFLOW',
    entity_id: req.params.id,
    old_value: workflow,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'workflow_deleted', { id: req.params.id });
  return success(res, 200, null, 'Workflow deleted successfully');
});

export const listChainSteps = asyncHandler(async (req, res) => {
  const steps = await ApprovalChain.listByWorkflowId(req.params.workflowId);
  return success(res, 200, steps, 'Approval chain steps retrieved');
});

export const createChainStep = asyncHandler(async (req, res) => {
  const id = await ApprovalChain.create({ ...req.body, workflow_id: req.params.workflowId });
  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_APPROVAL_CHAIN_STEP',
    entity_type: 'APPROVAL_CHAIN',
    entity_id: id,
    new_value: { ...req.body, workflow_id: req.params.workflowId },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'approval_chain_step_created', { id });
  return success(res, 201, { id }, 'Chain step created');
});

export const updateChainStep = asyncHandler(async (req, res) => {
  const step = await ApprovalChain.findById(req.params.id);
  if (!step) throw new NotFoundError('Chain step not found');
  await ApprovalChain.update(req.params.id, req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_APPROVAL_CHAIN_STEP',
    entity_type: 'APPROVAL_CHAIN',
    entity_id: req.params.id,
    old_value: step,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'approval_chain_step_updated', { id: req.params.id });
  return success(res, 200, null, 'Chain step updated');
});

export const deleteChainStep = asyncHandler(async (req, res) => {
  const step = await ApprovalChain.findById(req.params.id);
  if (!step) throw new NotFoundError('Chain step not found');
  await ApprovalChain.delete(req.params.id);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'DELETE_APPROVAL_CHAIN_STEP',
    entity_type: 'APPROVAL_CHAIN',
    entity_id: req.params.id,
    old_value: step,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'approval_chain_step_deleted', { id: req.params.id });
  return success(res, 200, null, 'Chain step deleted');
});
