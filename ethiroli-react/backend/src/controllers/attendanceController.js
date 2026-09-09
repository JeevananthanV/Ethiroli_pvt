import Attendance from '../models/Attendance.js';
import { broadcastToRole, broadcastToUser } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';

export const getAttendanceSummary = asyncHandler(async (req, res) => {
  const user_id = req.user.role === 'EMPLOYEE' || req.user.role === 'INTERN' ? req.user.id : req.query.user_id;
  const list = await Attendance.list({ user_id, start_date: req.query.start_date, end_date: req.query.end_date });
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
  const user_id = req.user.role === 'EMPLOYEE' || req.user.role === 'INTERN' ? req.user.id : req.query.user_id;
  const list = await Attendance.list({
    user_id,
    start_date: req.query.start_date,
    end_date: req.query.end_date
  });
  return success(res, 200, list);
});

export const checkIn = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  await Attendance.checkIn(userId);
  broadcastToRole('HR', 'attendance_check_in', { userId, time: new Date() });
  return success(res, 200, null, 'Checked in successfully');
});

export const checkOut = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  await Attendance.checkOut(userId);
  broadcastToRole('HR', 'attendance_check_out', { userId, time: new Date() });
  return success(res, 200, null, 'Checked out successfully');
});

export const manualCorrect = asyncHandler(async (req, res) => {
  await Attendance.manualCorrect(req.params.id, req.body);
  return success(res, 200, null, 'Attendance correction saved');
});
