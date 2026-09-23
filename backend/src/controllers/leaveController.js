import Leave from '../models/Leave.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole, broadcastToUser } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listLeaves = asyncHandler(async (req, res) => {
  const user_id = ['EMPLOYEE', 'INTERN'].includes(req.user.role) ? req.user.id : req.query.user_id;
  const list = await Leave.list({ status: req.query.status, user_id });
  return success(res, 200, list);
});

export const getLeave = asyncHandler(async (req, res) => {
  const leave = await Leave.findById(req.params.id);
  if (!leave) throw new NotFoundError('Leave not found');
  await AuditLog.create({
    user_id: req.user.id,
    action: 'VIEW_LEAVE',
    entity_type: 'LEAVE',
    entity_id: req.params.id,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  return success(res, 200, leave);
});

export const applyLeave = asyncHandler(async (req, res) => {
  await Leave.create({ ...req.body, user_id: req.user.id });
  await AuditLog.create({
    user_id: req.user.id,
    action: 'APPLY_LEAVE',
    entity_type: 'LEAVE',
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('HR', 'leave_applied', { user_id: req.user.id, name: req.user.full_name });
  return success(res, 201, null, 'Leave request submitted successfully');
});

export const updateLeaveStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const leave = await Leave.findById(req.params.id);
  if (!leave) throw new NotFoundError('Leave not found');
  await Leave.updateStatus(req.params.id, status, req.user.id);
  if (leave) {
    broadcastToUser(leave.user_id, 'leave_status_updated', { id: req.params.id, status });
  }
  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_LEAVE_STATUS',
    entity_type: 'LEAVE',
    entity_id: req.params.id,
    old_value: leave,
    new_value: { status },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('HR', 'leave_status_updated', { id: req.params.id, status });

  if (status === 'APPROVED') {
    try {
      const CalendarEvent = (await import('../models/CalendarEvent.js')).default;
      const notificationRouter = (await import('../services/notificationRouter.js')).default;

      const calEventId = await CalendarEvent.create({
        title: `Leave: ${leave.leave_type || 'Time Off'} - ${leave.user_name || 'Staff Member'}`,
        description: `Approved leave: ${leave.reason || 'Personal'}`,
        event_type: 'LEAVE',
        event_type_id: 'evt_leave',
        start_time: `${leave.start_date} 09:00:00`,
        end_time: `${leave.end_date} 18:00:00`,
        is_all_day: true,
        created_by: leave.user_id,
        assigned_users: [leave.user_id],
        status: 'scheduled',
        role: 'HR'
      });
      const calEvent = await CalendarEvent.findById(calEventId);
      await notificationRouter.route('created', calEvent, req.user.id, req.user.role);
    } catch (calErr) {
      console.error('Failed to auto-create calendar event for approved leave:', calErr);
    }
  }

  return success(res, 200, null, 'Leave status updated successfully');
});

export const cancelLeave = asyncHandler(async (req, res) => {
  const leave = await Leave.findById(req.params.id);
  if (!leave) throw new NotFoundError('Leave not found');
  await Leave.update(req.params.id, { status: 'CANCELLED' });
  await AuditLog.create({
    user_id: req.user.id,
    action: 'CANCEL_LEAVE',
    entity_type: 'LEAVE',
    entity_id: req.params.id,
    old_value: leave,
    new_value: { status: 'CANCELLED' },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToUser(leave.user_id, 'leave_cancelled', { id: req.params.id });
  broadcastToRole('HR', 'leave_cancelled', { id: req.params.id });
  return success(res, 200, null, 'Leave cancelled successfully');
});
