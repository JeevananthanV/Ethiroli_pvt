import Attendance from '../models/Attendance.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole, broadcastToUser } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const getAttendanceSummary = asyncHandler(async (req, res) => {
  const isManager = ['HR', 'ADMIN', 'SUPER_ADMIN'].includes(req.user.role);
  const isTutorViewingStudents = req.user.role === 'TUTOR' && (req.query.role === 'STUDENT' || req.query.user_id);
  const isSelfOnly = !isManager && !isTutorViewingStudents;
  const user_id = isSelfOnly ? req.user.id : req.query.user_id;
  const role = !isSelfOnly ? req.query.role : undefined;
  const list = await Attendance.list({ user_id, role, start_date: req.query.start_date, end_date: req.query.end_date, limit: 1000 });
  const summary = {
    totalDays: list.length,
    presentDays: list.filter(a => a.status === 'PRESENT').length,
    absentDays: list.filter(a => a.status === 'ABSENT').length,
    halfDays: list.filter(a => a.status === 'HALF_DAY').length,
    lateCount: list.filter(a => a.is_late).length
  };
  return success(res, 200, summary);
});

export const listAttendance = asyncHandler(async (req, res) => {
  const isManager = ['HR', 'ADMIN', 'SUPER_ADMIN'].includes(req.user.role);
  const isTutorViewingStudents = req.user.role === 'TUTOR' && (req.query.role === 'STUDENT' || req.query.user_id);
  const isSelfOnly = !isManager && !isTutorViewingStudents;
  const user_id = isSelfOnly ? req.user.id : req.query.user_id;
  const role = !isSelfOnly ? req.query.role : undefined;
  const limit = req.query.limit ? parseInt(req.query.limit) : 50;
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const offset = (page - 1) * limit;

  const [list, total] = await Promise.all([
    Attendance.list({
      user_id,
      role,
      start_date: req.query.start_date,
      end_date: req.query.end_date,
      limit,
      offset
    }),
    Attendance.count({
      user_id,
      role,
      start_date: req.query.start_date,
      end_date: req.query.end_date
    })
  ]);

  return success(res, 200, list, 'Attendance records retrieved', {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
  });
});

export const checkIn = asyncHandler(async (req, res) => {
  const isPrivileged = ['HR', 'ADMIN', 'SUPER_ADMIN', 'TUTOR', 'RECEPTION'].includes(req.user.role);
  const userId = (isPrivileged && req.body.user_id) ? req.body.user_id : req.user.id;
  const date = req.body.date || new Date().toISOString().slice(0, 10);
  const status = req.body.status || 'PRESENT';

  await Attendance.checkIn(userId, date, status);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'CHECK_IN',
    entity_type: 'ATTENDANCE',
    entity_id: userId,
    new_value: { user_id: userId, time: new Date(), date, status },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('HR', 'attendance_check_in', { userId, time: new Date() });
  return success(res, 200, { user_id: userId, date, status, check_in_time: new Date() }, 'Checked in successfully');
});

export const checkOut = asyncHandler(async (req, res) => {
  const isPrivileged = ['HR', 'ADMIN', 'SUPER_ADMIN', 'TUTOR', 'RECEPTION'].includes(req.user.role);
  const userId = (isPrivileged && req.body.user_id) ? req.body.user_id : req.user.id;
  await Attendance.checkOut(userId);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'CHECK_OUT',
    entity_type: 'ATTENDANCE',
    entity_id: userId,
    new_value: { user_id: userId, time: new Date() },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('HR', 'attendance_check_out', { userId, time: new Date() });
  return success(res, 200, { user_id: userId, check_out_time: new Date() }, 'Checked out successfully');
});

export const manualCorrect = asyncHandler(async (req, res) => {
  const record = await Attendance.findById(req.params.id);
  if (!record) throw new NotFoundError('Attendance record not found');
  await Attendance.update(req.params.id, req.body);
  const updated = await Attendance.findById(req.params.id);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'MANUAL_CORRECT_ATTENDANCE',
    entity_type: 'ATTENDANCE',
    entity_id: req.params.id,
    old_value: record,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('HR', 'attendance_corrected', { id: req.params.id });
  return success(res, 200, updated, 'Attendance correction saved');
});


export const getAttendanceById = asyncHandler(async (req, res) => {

  const record = await Attendance.findById(req.params.id);
  if (!record) throw new NotFoundError('Attendance record not found');
  return success(res, 200, record, 'Attendance record retrieved');
});

export const deleteAttendance = asyncHandler(async (req, res) => {
  const record = await Attendance.findById(req.params.id);
  if (!record) throw new NotFoundError('Attendance record not found');
  await Attendance.delete(req.params.id);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'DELETE_ATTENDANCE',
    entity_type: 'ATTENDANCE',
    entity_id: req.params.id,
    old_value: record,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('HR', 'attendance_deleted', { id: req.params.id });
  return success(res, 200, null, 'Attendance record deleted');
});
