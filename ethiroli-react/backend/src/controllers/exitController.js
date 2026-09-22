import ExitRequest from '../models/ExitRequest.js';
import AuditLog from '../models/AuditLog.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listExitRequests = asyncHandler(async (req, res) => {
  const { status, employee_id, limit = 50, offset = 0 } = req.query;
  const list = await ExitRequest.list({
    status,
    employee_id,
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10)
  });
  return success(res, 200, list);
});

export const createExitRequest = asyncHandler(async (req, res) => {
  const { employee_id, resignation_date, requested_last_day, reason, notice_period_days } = req.body;
  const id = await ExitRequest.create({
    employee_id,
    resignation_date,
    requested_last_day,
    reason,
    notice_period_days
  });

  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_EXIT_REQUEST',
    entity_type: 'EXIT_REQUEST',
    entity_id: id,
    new_value: { employee_id, resignation_date, requested_last_day },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  return success(res, 201, { id }, 'Resignation / Exit request submitted successfully');
});

export const getExitRequest = asyncHandler(async (req, res) => {
  const item = await ExitRequest.findById(req.params.id);
  if (!item) throw new NotFoundError('Exit request not found');
  const checklist = await ExitRequest.getChecklist(req.params.id);
  return success(res, 200, { ...item, checklist });
});

export const updateExitRequest = asyncHandler(async (req, res) => {
  const item = await ExitRequest.findById(req.params.id);
  if (!item) throw new NotFoundError('Exit request not found');

  const { status, approved_last_day, exit_interview_notes } = req.body;
  await ExitRequest.update(req.params.id, {
    status,
    approved_last_day,
    exit_interview_notes,
    approved_by: req.user.id
  });

  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_EXIT_REQUEST',
    entity_type: 'EXIT_REQUEST',
    entity_id: req.params.id,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  return success(res, 200, null, 'Exit request updated successfully');
});

export const updateChecklistTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { is_cleared, remarks } = req.body;
  await ExitRequest.updateChecklistTask(taskId, {
    is_cleared: is_cleared === true || is_cleared === 'true',
    cleared_by: req.user.id,
    remarks
  });
  return success(res, 200, null, 'Checklist task updated successfully');
});

export default {
  listExitRequests,
  createExitRequest,
  getExitRequest,
  updateExitRequest,
  updateChecklistTask
};
