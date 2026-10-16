import pool from '../config/database.js';
import Attendance from '../models/Attendance.js';
import AttendanceSession from '../models/AttendanceSession.js';
import ActivityFeed from '../models/ActivityFeed.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole, broadcastToUser } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';
import { businessDate, BUSINESS_TIMEZONE } from '../config/timezone.js';

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
  const date = req.body.date || Attendance.today();
  const status = req.body.status || 'PRESENT';
  const workMode = req.body.work_mode || null;

  await Attendance.checkIn(userId, date, status, workMode);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'CHECK_IN',
    entity_type: 'ATTENDANCE',
    entity_id: userId,
    new_value: { user_id: userId, time: new Date(), date, status, work_mode: workMode },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('HR', 'attendance_check_in', { userId, time: new Date() });
  return success(res, 200, { user_id: userId, date, status, work_mode: workMode, check_in_time: new Date() }, 'Checked in successfully');
});

export const checkOut = asyncHandler(async (req, res) => {
  const isPrivileged = ['HR', 'ADMIN', 'SUPER_ADMIN', 'TUTOR', 'RECEPTION'].includes(req.user.role);
  const userId = (isPrivileged && req.body.user_id) ? req.body.user_id : req.user.id;
  // The UPDATE is a no-op when there is no open punch, which used to be
  // reported to the client as a successful checkout.
  const updated = await Attendance.checkOut(userId);
  if (!updated) {
    throw new BadRequestError('You have no open check-in for today, so there is nothing to check out of.');
  }
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

/* ---------------------------------------------------------------------------
 * Self-scoped, session-based attendance (the punch-clock surface).
 *
 * These mirror /v1/employee/attendance/* for the other role portals, so the
 * Intern portal can use the same attendance UI as the Employee portal instead
 * of the older day-row-only flow. Always scoped to req.user.id: a caller can
 * never pass a user_id, so there is no way to punch in for someone else.
 * ------------------------------------------------------------------------- */

export const getMyTodayAttendance = asyncHandler(async (req, res) => {
  const summary = await Attendance.getDaySummary(req.user.id, businessDate());
  return success(res, 200, { ...summary, timezone: BUSINESS_TIMEZONE }, 'Today attendance retrieved');
});

export const getMyAttendanceHistory = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const to = req.query.end_date || businessDate();
  // 365 rows covers a full year in one round trip, which is what the KPI tiles
  // are computed from.
  const from = req.query.start_date || businessDate(new Date(Date.now() - 365 * 86400000));
  const limit = Math.max(1, parseInt(req.query.limit, 10) || 365);

  const [records, rollup, allSessions, leaveRows] = await Promise.all([
    Attendance.list({ user_id: userId, start_date: from, end_date: to, limit, offset: 0 }),
    AttendanceSession.dailyRollup(userId, from, to),
    AttendanceSession.listRange(userId, from, to),
    pool.execute(
      `SELECT DATE_FORMAT(start_date, '%Y-%m-%d') AS start_date,
              DATE_FORMAT(end_date, '%Y-%m-%d') AS end_date,
              leave_type, reason, status
       FROM leaves
       WHERE user_id = ? AND status = 'APPROVED'
         AND start_date <= ? AND end_date >= ?`,
      [userId, to, from]
    ).then(([rows]) => rows).catch(() => []),
  ]);

  const leaveByDate = new Map();
  for (const l of leaveRows) {
    const s = l.start_date;
    const e = l.end_date;
    if (!s || !e) continue;
    for (let d = new Date(`${s}T00:00:00Z`); d <= new Date(`${e}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + 1)) {
      leaveByDate.set(d.toISOString().slice(0, 10), l);
    }
  }

  const rollupByDate = new Map(rollup.map((r) => [r.work_date, r]));
  const sessionsByDate = new Map();
  for (const s of allSessions) {
    const list = sessionsByDate.get(s.work_date) || [];
    list.push(s);
    sessionsByDate.set(s.work_date, list);
  }

  const enriched = records.map((r) => {
    const workDate = r.work_date || (r.date ? String(r.date).slice(0, 10) : null);
    const day = rollupByDate.get(workDate);
    const sessions = sessionsByDate.get(workDate) || [];
    const hasSessions = sessions.length > 0;

    // First-in / last-out come from the sessions when there are any
    const firstCheckIn = hasSessions
      ? (sessions.find((s) => s.check_in_time)?.check_in_time ?? null)
      : (r.check_in_time ?? null);
    const lastCheckOut = hasSessions
      ? ([...sessions].reverse().find((s) => s.check_out_time)?.check_out_time ?? null)
      : (r.check_out_time ?? null);

    // Rule: arrivals after 10:30 AM (IST) are marked as late
    let isLate = false;
    if (r.status === 'PRESENT' && firstCheckIn) {
      try {
        const d = new Date(firstCheckIn);
        const parts = d.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour12: false }).split(':');
        const minutes = Number(parts[0]) * 60 + Number(parts[1]);
        isLate = minutes > (10 * 60 + 30);
      } catch (_) {
        isLate = Boolean(r.is_late);
      }
    } else {
      isLate = Boolean(r.is_late);
    }

    const isLeave = r.status === 'LEAVE' || (leaveByDate.has(workDate) && !hasSessions);
    const leaveInfo = leaveByDate.get(workDate);

    return {
      ...r,
      work_date: workDate,
      check_in_time: isLeave ? null : firstCheckIn,
      check_out_time: isLeave ? null : lastCheckOut,
      first_check_in: isLeave ? null : firstCheckIn,
      last_check_out: isLeave ? null : lastCheckOut,
      session_count: isLeave ? 0 : (hasSessions ? sessions.length : Number(r.session_count || 0)),
      sessions: isLeave ? [] : sessions,
      has_sessions: hasSessions && !isLeave,
      worked_minutes: isLeave ? 0 : (hasSessions ? (day?.worked_minutes ?? 0) : Math.round(Number(r.total_hours || 0) * 60)),
      worked_hours: isLeave ? 0 : (hasSessions
        ? Number(((day?.worked_minutes ?? 0) / 60).toFixed(2))
        : Number(r.total_hours || 0)),
      status: isLeave ? 'LEAVE' : (r.status || 'PRESENT'),
      is_late: isLeave ? false : isLate,
      is_open: isLeave ? false : Boolean(day?.is_open),
      leave_type: leaveInfo?.leave_type || (isLeave ? 'CASUAL' : null),
      reason: leaveInfo?.reason || (isLeave ? 'Approved Leave' : null)
    };
  });

  // Inject approved leaves for dates without attendance rows
  const existingDates = new Set(enriched.map((r) => r.work_date));
  for (const [leaveDate, l] of leaveByDate) {
    if (existingDates.has(leaveDate)) continue;
    enriched.push({
      id: `leave-${leaveDate}`,
      work_date: leaveDate,
      date: leaveDate,
      check_in_time: null,
      check_out_time: null,
      first_check_in: null,
      last_check_out: null,
      status: 'LEAVE',
      is_late: false,
      session_count: 0,
      sessions: [],
      has_sessions: false,
      worked_minutes: 0,
      worked_hours: 0,
      is_open: false,
      leave_type: l.leave_type,
      reason: l.reason,
    });
  }

  // Days that have sessions but no legacy attendance row
  const allDates = new Set(enriched.map((r) => r.work_date));
  for (const [workDate, day] of rollupByDate) {
    if (allDates.has(workDate)) continue;
    const sessions = sessionsByDate.get(workDate) || [];
    let isLate = false;
    if (day.first_check_in) {
      try {
        const d = new Date(day.first_check_in);
        const parts = d.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour12: false }).split(':');
        const minutes = Number(parts[0]) * 60 + Number(parts[1]);
        isLate = minutes > (10 * 60 + 30);
      } catch (_) {}
    }
    enriched.push({
      id: `sessions-${workDate}`,
      work_date: workDate,
      date: workDate,
      check_in_time: day.first_check_in,
      check_out_time: day.last_check_out,
      status: 'PRESENT',
      is_late: isLate,
      session_count: sessions.length,
      sessions,
      has_sessions: true,
      worked_minutes: day.worked_minutes,
      worked_hours: Number((day.worked_minutes / 60).toFixed(2)),
      is_open: day.is_open,
    });
  }
  enriched.sort((a, b) => (a.work_date < b.work_date ? 1 : -1));

  return success(res, 200, enriched, 'Attendance history retrieved', { timezone: BUSINESS_TIMEZONE });
});

export const punchMyAttendance = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const action = req.body?.action;
  const workDate = businessDate();

  if (action === 'CHECK_IN') {
    const active = await AttendanceSession.getActiveSession(userId);
    if (active) {
      throw new BadRequestError('You are already punched in. Please punch out before starting a new session.');
    }
    const mode = req.body?.work_mode === 'OFFICE' ? 'OFFICE' : 'REMOTE';
    await AttendanceSession.startSession({ userId, workDate, checkInTime: new Date() });
    // attendance_sessions has no work_mode column, so the mode is written on the
    // legacy day row by syncDayRow's caller instead - kept here only so the
    // client can still report which mode the intern punched in for.
    await Attendance.checkIn(userId, workDate, 'PRESENT', mode).catch(() => {});
    const summary = await Attendance.syncDayRow(userId, workDate);
    await ActivityFeed.create({
      user_id: userId,
      actor_id: userId,
      event_type: 'ATTENDANCE_PUNCH_IN',
      entity_type: 'Attendance',
      entity_id: null,
      payload: { work_date: workDate, at: new Date().toISOString() }
    });
    broadcastToRole('HR', 'attendance_check_in', { userId, time: new Date() });
    return success(res, 200, summary, 'Punched in successfully');
  }

  if (action === 'CHECK_OUT') {
    const active = await AttendanceSession.getActiveSession(userId);
    if (!active) {
      throw new BadRequestError('You are not currently punched in. Please punch in first.');
    }
    await AttendanceSession.endSession({ userId, checkOutTime: new Date() });
    const summary = await Attendance.syncDayRow(userId, workDate);
    await ActivityFeed.create({
      user_id: userId,
      actor_id: userId,
      event_type: 'ATTENDANCE_PUNCH_OUT',
      entity_type: 'Attendance',
      entity_id: null,
      payload: {
        work_date: workDate,
        worked_hours: summary?.worked_hours ?? 0,
        at: new Date().toISOString()
      }
    });
    broadcastToRole('HR', 'attendance_check_out', { userId, time: new Date() });
    return success(res, 200, summary, 'Punched out successfully');
  }

  throw new BadRequestError('Invalid punch action. Must be CHECK_IN or CHECK_OUT');
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
