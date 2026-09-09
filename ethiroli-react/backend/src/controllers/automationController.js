import AutomationWorkflow from '../models/AutomationWorkflow.js';
import AuditLog from '../models/AuditLog.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listWorkflows = asyncHandler(async (req, res) => {
  const { is_active, page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [items, countRow] = await Promise.all([
    AutomationWorkflow.list({ tenant_id: req.tenant?.id, is_active, limit: parseInt(limit), offset }),
    AutomationWorkflow.count({ tenant_id: req.tenant?.id, is_active })
  ]);

  return success(res, 200, items, 'Automation workflows retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total: countRow,
    totalPages: Math.ceil(countRow / parseInt(limit))
  });
});

export const createWorkflow = asyncHandler(async (req, res) => {
  const id = await AutomationWorkflow.create({ ...req.body, tenant_id: req.tenant?.id, created_by: req.user.id });
  return success(res, 201, { id }, 'Automation workflow created');
});

export const getWorkflow = asyncHandler(async (req, res) => {
  const workflow = await AutomationWorkflow.findById(req.params.id);
  if (!workflow) throw new NotFoundError('Automation workflow not found');
  return success(res, 200, workflow, 'Automation workflow retrieved');
});

export const updateWorkflow = asyncHandler(async (req, res) => {
  const workflow = await AutomationWorkflow.findById(req.params.id);
  if (!workflow) throw new NotFoundError('Automation workflow not found');
  await AutomationWorkflow.update(req.params.id, req.body);
  return success(res, 200, null, 'Automation workflow updated');
});

export const executeWorkflow = asyncHandler(async (req, res) => {
  const workflow = await AutomationWorkflow.findById(req.params.id);
  if (!workflow) throw new NotFoundError('Automation workflow not found');
  await AuditLog.create({
    user_id: req.user.id,
    action: 'EXECUTE_AUTOMATION_WORKFLOW',
    entity_type: 'AUTOMATION_WORKFLOW',
    entity_id: req.params.id,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  return success(res, 200, { execution_id: 'exec-' + Date.now() }, 'Workflow execution triggered');
});
