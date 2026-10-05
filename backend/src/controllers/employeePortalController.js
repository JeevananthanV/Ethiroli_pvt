import pool from '../config/database.js';
import Employee from '../models/Employee.js';
import Attendance from '../models/Attendance.js';
import AttendanceSession from '../models/AttendanceSession.js';
import { businessDate, BUSINESS_TIMEZONE } from '../config/timezone.js';
import Leave from '../models/Leave.js';
import Task from '../models/Task.js';
import ProjectMember from '../models/ProjectMember.js';
import SupportTicket from '../models/SupportTicket.js';
import EmployeeDocument from '../models/EmployeeDocument.js';
import Payroll from '../models/Payroll.js';
import User from '../models/User.js';
import UserBadge from '../models/UserBadge.js';
import Message from '../models/Message.js';
import ActivityFeed from '../models/ActivityFeed.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success, error } from '../utils/response.js';
import { NotFoundError, BadRequestError, AuthorizationError } from '../utils/errors.js';
import { decrypt } from '../config/encryption.js';

// Allowed ENUM values (mirror the database schemas) — validated before insert
// so invalid input returns 400 instead of a raw DB error / 500.
const LEAVE_TYPES = ['CASUAL', 'SICK', 'EARNED'];
const SUPPORT_CATEGORIES = ['IT_SUPPORT', 'HR_QUERY', 'PAYROLL_ISSUE', 'FACILITIES', 'ADMIN'];
const SUPPORT_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
const DOCUMENT_TYPES = ['RESUME', 'OFFER_LETTER', 'APPOINTMENT_LETTER', 'NDA', 'ID_PROOF', 'DEGREE_CERTIFICATE', 'EXPERIENCE_LETTER', 'PAYSLIP', 'OTHER'];
const TASK_STATUSES = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];

// users.avatar_url is MEDIUMTEXT; this caps a base64 data-URL avatar so an
// oversized payload is rejected with a 400 instead of being stored.
const MAX_AVATAR_BYTES = 512 * 1024;

// Day names indexed by Date#getUTCDay(), used by the monthly attendance payload.
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Normalises a MySQL DATE column to a `YYYY-MM-DD` string.
 *
 * mysql2 hands a DATE back as a JS Date constructed at LOCAL midnight, so
 * `new Date(value).toISOString().slice(0,10)` silently shifts the calendar day
 * one day backwards for every timezone east of UTC - and this project runs on
 * Asia/Kolkata. That made `employees.date_of_joining = 2026-10-01` read back as
 * "2026-09-30", which in turn mis-marked the joining day and would have
 * mis-marked every holiday and every approved-leave day. Reading the local
 * date parts keeps the day the database actually stores.
 *
 * Accepts a Date (mysql2 DATE), an ISO string, or a `yyyy-mm-dd` prefix.
 */
const toDateKey = (value) => {
  if (!value) return null;
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null;
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, '0');
    const d = String(value.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? match[0] : null;
};

// Employment/payroll fields owned by HR, Finance and Admin. The employee profile
// endpoint only ever writes name, phone, preferences and avatar, so these could
// never be changed from here - but a crafted request used to be accepted and
// silently dropped, which hid a privilege-escalation attempt. An explicit
// attempt is now refused with 403 AuthorizationError.
const PROTECTED_EMPLOYEE_FIELDS = [
  'pan',
  'pf_number',
  'uan',
  'bank_account',
  'bank_ifsc',
  'employee_code',
  'department',
  'designation',
  'date_of_joining',
  'employment_type',
  'work_location',
  'reporting_manager_id',
  'salary',
  'role'
];

// 1. Dashboard Overview
export const getDashboardOverview = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const today = businessDate();

  const emp = await Employee.findByUserId(userId);

  // Run queries in parallel. The attendance widget is built from the same
  // session source as the Attendance page so both always agree.
  const [
    attendanceSummary,
    [leaveBalanceRows],
    [taskRows],
    [projectRows],
    [unreadMessagesRows],
    [announcementRows]
  ] = await Promise.all([
    Attendance.getDaySummary(userId, today),
    pool.execute('SELECT * FROM leave_balances WHERE user_id = ?', [userId]),
    pool.execute('SELECT * FROM tasks WHERE assigned_to = ? ORDER BY due_date ASC LIMIT 5', [userId]),
    pool.execute(
      `SELECT COUNT(*) as count FROM project_members WHERE user_id = ?`,
      [userId]
    ),
    pool.execute(
      `SELECT COUNT(*) as count FROM messages WHERE recipient_id = ? AND is_read = FALSE`,
      [userId]
    ),
    pool.execute(
      `SELECT id, subject, content, created_at FROM communication_logs WHERE channel = 'ANNOUNCEMENT' ORDER BY created_at DESC LIMIT 5`
    )
  ]);

  return success(res, 200, {
    employee: emp,
    // Session-aware attendance widget (same source as GET /attendance/today).
    todayAttendance: attendanceSummary,
    attendance: attendanceSummary,
    leaveBalances: leaveBalanceRows,
    upcomingTasks: taskRows,
    projectsCount: projectRows[0]?.count || 0,
    unreadMessagesCount: unreadMessagesRows[0]?.count || 0,
    recentAnnouncements: announcementRows,
    timezone: BUSINESS_TIMEZONE
  }, 'Employee dashboard overview retrieved');
});

// 2. Attendance & Punch Clock
// Supports multiple work sessions per day. Daily worked time is the SUM of each
// session's duration, so un-punched breaks/lunch are excluded.
export const punchAttendance = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { action } = req.body; // 'CHECK_IN' | 'CHECK_OUT'
  const workDate = businessDate();

  if (action === 'CHECK_IN') {
    // Reject a second punch-in while a session is already open.
    const active = await AttendanceSession.getActiveSession(userId);
    if (active) {
      throw new BadRequestError(
        'You are already punched in. Please punch out before starting a new session.'
      );
    }
    await AttendanceSession.startSession({ userId, workDate, checkInTime: new Date() });
    const summary = await Attendance.syncDayRow(userId, workDate);
    await ActivityFeed.create({
      user_id: userId,
      actor_id: userId,
      event_type: 'ATTENDANCE_PUNCH_IN',
      entity_type: 'Attendance',
      entity_id: null,
      payload: { work_date: workDate, at: new Date().toISOString() }
    });
    return success(res, 200, summary, 'Punched in successfully');
  }

  if (action === 'CHECK_OUT') {
    // Reject a punch-out with no open session.
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
    return success(res, 200, summary, 'Punched out successfully');
  }

  throw new BadRequestError('Invalid punch action. Must be CHECK_IN or CHECK_OUT');
});

export const getTodayAttendance = asyncHandler(async (req, res) => {
  const summary = await Attendance.getDaySummary(req.user.id, businessDate());
  return success(res, 200, { ...summary, timezone: BUSINESS_TIMEZONE }, 'Today attendance retrieved');
});

export const getAttendanceHistory = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { start_date, end_date, limit = 50, page = 1 } = req.query;
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const pageSize = Math.max(1, parseInt(limit, 10) || 50);
  const offset = (pageNum - 1) * pageSize;

  // Default window: last 60 days up to today (business timezone).
  const to = end_date || businessDate();
  const from = start_date || businessDate(new Date(Date.now() - 60 * 86400000));

  const [records] = await Promise.all([
    Attendance.list({ user_id: userId, start_date: from, end_date: to, limit: pageSize, offset }),
  ]);

  // Attach the per-day session detail so history shows multiple sessions/day.
  const rollup = await AttendanceSession.dailyRollup(userId, from, to);
  const rollupByDate = new Map(rollup.map((r) => [r.work_date, r]));
  const sessionsByDate = new Map();
  for (const s of await AttendanceSession.listRange(userId, from, to)) {
    const list = sessionsByDate.get(s.work_date) || [];
    list.push(s);
    sessionsByDate.set(s.work_date, list);
  }

  const enriched = records.map((r) => {
    const workDate = r.work_date || (r.date ? String(r.date).slice(0, 10) : null);
    const day = rollupByDate.get(workDate);
    const sessions = sessionsByDate.get(workDate) || [];
    const hasSessions = sessions.length > 0;

    // First-in / last-out are taken from the actual sessions whenever there are
    // any, and only fall back to the legacy daily row for days that predate
    // sessions.
    //
    // Previously both came straight from `attendance.check_in_time` /
    // `check_out_time`. Those columns are written by syncDayRow and are not
    // always refreshed, so a day whose sessions had all ended could still report
    // check_out_time = NULL - the history table then showed "Punched out: open"
    // for a day that was actually finished. Anyone using that record to show a
    // manager worked hours would have been reading a stale value.
    const firstCheckIn = hasSessions
      ? (sessions.find((s) => s.check_in_time)?.check_in_time ?? null)
      : (r.check_in_time ?? null);

    const lastCheckOut = hasSessions
      ? ([...sessions].reverse().find((s) => s.check_out_time)?.check_out_time ?? null)
      : (r.check_out_time ?? null);

    return {
      ...r,
      work_date: workDate,
      check_in_time: firstCheckIn,
      check_out_time: lastCheckOut,
      first_check_in: firstCheckIn,
      last_check_out: lastCheckOut,
      session_count: hasSessions ? sessions.length : Number(r.session_count || 0),
      sessions,
      has_sessions: hasSessions,
      // True worked time (excludes breaks) when sessions exist.
      worked_minutes: hasSessions ? day?.worked_minutes ?? 0 : Math.round(Number(r.total_hours || 0) * 60),
      worked_hours: hasSessions
        ? Number(((day?.worked_minutes ?? 0) / 60).toFixed(2))
        : Number(r.total_hours || 0),
      // Still clocked in only when a session is genuinely open, so a finished
      // day never renders as "open".
      is_open: Boolean(day?.is_open),
    };
  });

  // Include days that have sessions but no legacy `attendance` row (e.g. after a
  // schema backfill) so the history never hides real worked time.
  const legacyDates = new Set(enriched.map((r) => r.work_date));
  for (const [workDate, day] of rollupByDate) {
    if (legacyDates.has(workDate)) continue;
    const sessions = sessionsByDate.get(workDate) || [];
    enriched.push({
      id: `sessions-${workDate}`,
      work_date: workDate,
      date: workDate,
      check_in_time: day.first_check_in,
      check_out_time: day.last_check_out,
      status: 'PRESENT',
      is_late: false,
      session_count: sessions.length,
      sessions,
      has_sessions: true,
      worked_minutes: day.worked_minutes,
      worked_hours: Number((day.worked_minutes / 60).toFixed(2)),
      is_open: day.is_open,
    });
  }
  enriched.sort((a, b) => (a.work_date < b.work_date ? 1 : -1));

  return success(res, 200, enriched, 'Attendance history retrieved', {
    page: pageNum,
    limit: pageSize,
    total: enriched.length,
    totalPages: Math.ceil(enriched.length / pageSize),
    start_date: from,
    end_date: to,
    timezone: BUSINESS_TIMEZONE
  });
});

/**
 * GET /v1/employee/attendance/monthly?month=YYYY-MM
 *
 * Per-day attendance state plus a monthly summary for the calendar.
 *
 * Identity comes from the authenticated token only - there is deliberately no
 * employee/user parameter, so one employee can never read another's calendar.
 *
 * Status derivation (all of it from real records, nothing invented):
 *   HOLIDAY  - every Sunday (the weekly holiday) plus any date listed in the
 *              holidays table. Never PRESENT, never ABSENT, and excluded from the
 *              working-day, present, absent and percentage figures. Saturday is a
 *              normal working day.
 *   PRESENT  - the day has an attendance row or at least one attendance session
 *   LEAVE    - working day covered by an APPROVED leave request
 *   ABSENT   - working day, no punch, not on approved leave, the business day has
 *              already ended AND the employee was already onboarded. The current
 *              business day is IN_PROGRESS and future days are UPCOMING, so a day
 *              that has not happened yet is never reported as an absence.
 *   NOT_JOINED - up to and including the employee's date_of_joining, because an
 *              employee cannot be absent from a job they had not started.
 * Worked minutes come from the attendance_sessions rollup whenever sessions
 * exist, matching /v1/employee/attendance.
 */
export const getMonthlyAttendance = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const today = businessDate();

  const requestedMonth = req.query.month;
  const monthMatch = requestedMonth === undefined || requestedMonth === ''
    ? null
    : /^(\d{4})-(\d{2})$/.exec(String(requestedMonth));
  if (requestedMonth !== undefined && requestedMonth !== '' && !monthMatch) {
    throw new BadRequestError('month must be in YYYY-MM format');
  }
  const month = monthMatch ? monthMatch[0] : today.slice(0, 7);
  const year = Number(month.slice(0, 4));
  const monthIndex = Number(month.slice(5, 7)) - 1;
  if (monthIndex < 0 || monthIndex > 11) {
    throw new BadRequestError('month must be a real calendar month');
  }

  const firstDay = new Date(Date.UTC(year, monthIndex, 1));
  const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  const from = firstDay.toISOString().slice(0, 10);
  const to = new Date(Date.UTC(year, monthIndex, daysInMonth)).toISOString().slice(0, 10);

  const emp = await Employee.findByUserId(userId);
  const joiningDate = toDateKey(emp?.date_of_joining);

  const [legacyRows, rollupRows, leaveRows, holidayRows] = await Promise.all([
    Attendance.list({ user_id: userId, start_date: from, end_date: to, limit: daysInMonth + 5 }),
    AttendanceSession.dailyRollup(userId, from, to),
    pool.execute(
      `SELECT start_date, end_date, leave_type
         FROM leaves
        WHERE user_id = ? AND status = 'APPROVED'
          AND start_date <= ? AND end_date >= ?`,
      [userId, to, from]
    ).then(([rows]) => rows),
    // The holidays table is currently empty in this environment, so this simply
    // yields no holidays rather than a fabricated list.
    pool.execute('SELECT date FROM holidays WHERE date BETWEEN ? AND ?', [from, to])
      .then(([rows]) => rows)
  ]);

  const attendanceByDate = new Map(legacyRows.map((r) => [toDateKey(r.work_date), r]));
  const rollupByDate = new Map(rollupRows.map((r) => [toDateKey(r.work_date), r]));
  const holidayDates = new Set(
    holidayRows.map((h) => toDateKey(h.date)).filter(Boolean)
  );

  const leavesByDate = new Set();
  for (const l of leaveRows) {
    const s = toDateKey(l.start_date);
    const e = toDateKey(l.end_date);
    if (!s || !e) continue;
    for (let d = new Date(`${s}T00:00:00Z`); d <= new Date(`${e}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + 1)) {
      leavesByDate.add(d.toISOString().slice(0, 10));
    }
  }

  const summary = {
    working_days: 0,
    elapsed_working_days: 0,
    present_days: 0,
    absent_days: 0,
    leave_days: 0,
    // Sundays in the month (the weekly holiday) - excluded from every count.
    sunday_holidays: 0,
    // Additional holidays declared in the `holidays` table, also excluded.
    holiday_days: 0,
    total_holidays: 0,
    not_joined_days: 0,
    in_progress_days: 0,
    upcoming_days: 0,
    // Punches that landed on a Sunday / declared holiday.
    present_on_holidays: 0,
    late_days: 0,
    total_worked_minutes: 0
  };

  const days = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(Date.UTC(year, monthIndex, i)).toISOString().slice(0, 10);
    const dow = new Date(`${date}T00:00:00Z`).getUTCDay();
    const dayName = DAY_NAMES[dow];

    // Weekly holiday rule: every Sunday is a holiday. Saturday is a working day.
    const isSunday = dow === 0;
    const isDeclaredHoliday = holidayDates.has(date);
    const isHoliday = isSunday || isDeclaredHoliday;
    const isWorkingDay = !isHoliday;
    const notOnboarded = Boolean(joiningDate && date <= joiningDate);

    const row = attendanceByDate.get(date);
    const rollup = rollupByDate.get(date);
    const hasAttendance = Boolean(row || rollup);
    const onLeave = leavesByDate.has(date);
    const isToday = date === today;
    const isFuture = date > today;

    const punchIn = rollup?.first_check_in || row?.check_in_time || null;
    const punchOut = rollup?.last_check_out || row?.check_out_time || null;
    const workedMinutes = rollup
      ? Number(rollup.worked_minutes || 0)
      : Math.round(Number(row?.total_hours || 0) * 60);
    const sessionCount = rollup ? Number(rollup.session_count || 0) : Number(row?.session_count || 0);

    // A holiday is a holiday even if somebody punched in: it is never PRESENT and
    // never counted towards attendance.
    let status;
    if (isHoliday) status = 'HOLIDAY';
    else if (hasAttendance) status = 'PRESENT';
    else if (notOnboarded) status = 'NOT_JOINED';
    else if (onLeave) status = 'LEAVE';
    else if (isFuture) status = 'UPCOMING';
    else if (isToday) status = 'IN_PROGRESS';
    else status = 'ABSENT';

    const countsAsWorking = isWorkingDay && !notOnboarded;
    if (countsAsWorking) {
      summary.working_days += 1;
      // Days that have actually happened - the honest denominator mid-month.
      if (!isFuture) summary.elapsed_working_days += 1;
    }

    if (isHoliday) {
      summary.total_holidays += 1;
      if (isSunday) summary.sunday_holidays += 1;
      else summary.holiday_days += 1;
      if (hasAttendance) summary.present_on_holidays += 1;
    } else if (notOnboarded) summary.not_joined_days += 1;
    else if (status === 'PRESENT') {
      summary.present_days += 1;
      summary.total_worked_minutes += workedMinutes;
      if (row?.is_late) summary.late_days += 1;
    } else if (status === 'ABSENT') summary.absent_days += 1;
    else if (status === 'LEAVE') summary.leave_days += 1;
    else if (status === 'IN_PROGRESS') summary.in_progress_days += 1;
    else if (status === 'UPCOMING') summary.upcoming_days += 1;

    days.push({
      date,
      day: dayName,
      day_of_week: dow,
      // WORKING_DAY or HOLIDAY - drives the calendar's day colouring.
      type: isHoliday ? 'HOLIDAY' : 'WORKING_DAY',
      status,
      is_working_day: countsAsWorking,
      is_sunday: isSunday,
      is_holiday: isHoliday,
      is_today: isToday,
      punchIn,
      punchOut,
      worked_minutes: status === 'PRESENT' ? workedMinutes : 0,
      worked_hours: status === 'PRESENT' ? Number((workedMinutes / 60).toFixed(2)) : 0,
      session_count: status === 'PRESENT' ? sessionCount : 0,
      first_check_in: punchIn,
      last_check_out: punchOut
    });
  }

  const label = new Date(Date.UTC(year, monthIndex, 1)).toLocaleDateString('en-US', {
    month: 'long', year: 'numeric', timeZone: 'UTC'
  });

  // Present / Working Days x 100. Sundays and declared holidays are not in the
  // denominator. Mid-month the denominator is the working days that have already
  // happened, so a part-finished month is not reported as mostly absent; the
  // full-month figure is returned alongside it.
  const rate = (denominator) => (denominator > 0
    ? Number(((summary.present_days / denominator) * 100).toFixed(2))
    : null);

  return success(res, 200, {
    month,
    label,
    today,
    timezone: BUSINESS_TIMEZONE,
    joining_date: joiningDate,
    weekly_holiday: 'SUNDAY',
    days,
    summary: {
      ...summary,
      total_worked_hours: Number((summary.total_worked_minutes / 60).toFixed(2)),
      // null (not 0 or a guess) when there is nothing yet to divide.
      attendance_rate: rate(summary.elapsed_working_days),
      attendance_rate_full_month: rate(summary.working_days)
    }
  }, 'Monthly attendance retrieved');
});

// 3. Leaves & Balances
export const getLeavesAndBalances = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const currentYear = new Date().getFullYear().toString();

  const [balances, leaves] = await Promise.all([
    // Scoped to the current financial year. Without this a leave_balances table
    // holding more than one year produced duplicate rows for the same leave_type,
    // which collided on React's key and showed a stale entitlement.
    pool.execute(
      'SELECT * FROM leave_balances WHERE user_id = ? AND financial_year = ?',
      [userId, currentYear]
    ).then(([rows]) => rows),
    Leave.list({ user_id: userId, limit: 100 })
  ]);

  // Resolve who reviewed each request and when, so the employee can see not just
  // that a decision was made but who made it and at what time. `approved_by` is
  // stored on every status change, but the name was never joined in, so the Leave
  // Management table could only ever show a bare APPROVED badge.
  const reviewerIds = [...new Set(leaves.map((l) => l.approved_by).filter(Boolean))];
  const reviewersById = new Map();
  if (reviewerIds.length > 0) {
    const placeholders = reviewerIds.map(() => '?').join(', ');
    const [reviewerRows] = await pool.execute(
      `SELECT id, full_name, role FROM users WHERE id IN (${placeholders})`,
      reviewerIds
    );
    for (const r of reviewerRows) {
      reviewersById.set(r.id, {
        name: r.full_name ? decrypt(r.full_name) : null,
        role: r.role
      });
    }
  }

  const requests = leaves.map((l) => {
    const reviewer = l.approved_by ? reviewersById.get(l.approved_by) : null;
    return {
      ...l,
      // `updated_at` is the moment the status was last written, which for an
      // approved/rejected request is the review time.
      reviewed_at: ['APPROVED', 'REJECTED'].includes(String(l.status).toUpperCase())
        ? l.updated_at || null
        : null,
      reviewed_by_name: reviewer?.name || null,
      reviewed_by_role: reviewer?.role || null
    };
  });

  // Only balances that actually exist are returned. This endpoint previously
  // substituted invented 12 / 8 / 15-day balances when leave_balances was
  // empty, presenting a fabricated entitlement as a real one.
  return success(res, 200, {
    balances,
    requests,
    financial_year: currentYear
  }, 'Leaves and balances retrieved');
});

export const applyLeave = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { leave_type, start_date, end_date, reason } = req.body;

  if (!leave_type || !start_date || !end_date || !reason) {
    throw new BadRequestError('leave_type, start_date, end_date, and reason are required');
  }

  if (!LEAVE_TYPES.includes(leave_type)) {
    throw new BadRequestError(`Invalid leave_type. Must be one of: ${LEAVE_TYPES.join(', ')}`);
  }

  if (new Date(end_date) < new Date(start_date)) {
    throw new BadRequestError('end_date must be on or after start_date');
  }

  const id = await Leave.create({
    user_id: userId,
    leave_type,
    start_date,
    end_date,
    reason
  });

  // Persist a feed row so the Employee Notifications page has a real producer.
  // Previously nothing wrote activity_feeds for employee events, so the page
  // was structurally empty while its own copy promised leave updates.
  await ActivityFeed.create({
    user_id: userId,
    actor_id: userId,
    event_type: 'LEAVE_SUBMITTED',
    entity_type: 'Leave',
    entity_id: id,
    payload: { leave_type, start_date, end_date, reason, status: 'PENDING' }
  });

  return success(res, 201, { id }, 'Leave request submitted successfully');
});

// 4. Tasks & Projects
export const getAssignedTasks = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { status, limit = 50, page = 1 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  // Resolved separately from Task.list so the task rows themselves stay exactly
  // what the shared model returns - this only decorates them with human-readable
  // labels for the detail dialog. Every join is LEFT because project_id,
  // sprint_id and milestone_id are all nullable, and an inner join would silently
  // drop tasks that are not attached to a project.
  const decorateTasks = async (tasks) => {
    if (!tasks.length) return tasks;

    const collect = (key) => [...new Set(tasks.map((t) => t[key]).filter(Boolean))];
    const projectIds = collect('project_id');
    const sprintIds = collect('sprint_id');
    const milestoneIds = collect('milestone_id');

    const [projectRows, sprintRows, milestoneRows] = await Promise.all([
      projectIds.length
        ? pool.execute(
          `SELECT id, name FROM student_projects WHERE id IN (${projectIds.map(() => '?').join(',')})`,
          projectIds
        ).then(([r]) => r)
        : [],
      sprintIds.length
        ? pool.execute(
          `SELECT id, sprint_name, sprint_number, status FROM project_sprints WHERE id IN (${sprintIds.map(() => '?').join(',')})`,
          sprintIds
        ).then(([r]) => r)
        : [],
      milestoneIds.length
        ? pool.execute(
          `SELECT id, title, status, target_date FROM project_milestones WHERE id IN (${milestoneIds.map(() => '?').join(',')})`,
          milestoneIds
        ).then(([r]) => r)
        : []
    ]);

    const projectById = new Map(projectRows.map((p) => [p.id, p.name]));
    const sprintById = new Map(
      sprintRows.map((s) => [s.id, { name: s.sprint_name, number: s.sprint_number, status: s.status }])
    );
    const milestoneById = new Map(
      milestoneRows.map((m) => [m.id, { title: m.title, status: m.status, target_date: m.target_date }])
    );

    return tasks.map((t) => ({
      ...t,
      project_name: projectById.get(t.project_id) || null,
      sprint_name: sprintById.get(t.sprint_id)?.name || null,
      sprint_number: sprintById.get(t.sprint_id)?.number ?? null,
      sprint_status: sprintById.get(t.sprint_id)?.status || null,
      milestone_name: milestoneById.get(t.milestone_id)?.title || null,
      milestone_status: milestoneById.get(t.milestone_id)?.status || null,
      milestone_target_date: milestoneById.get(t.milestone_id)?.target_date || null
    }));
  };

  const [tasks, total] = await Promise.all([
    Task.list({ assigned_to: userId, status, limit: parseInt(limit), offset }),
    Task.count({ assigned_to: userId, status })
  ]);

  return success(res, 200, await decorateTasks(tasks), 'Assigned tasks retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    totalPages: Math.ceil(total / parseInt(limit))
  });
});

export const updateTaskStatus = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { status } = req.body;

  if (!TASK_STATUSES.includes(status)) {
    throw new BadRequestError(`Invalid status. Must be one of: ${TASK_STATUSES.join(', ')}`);
  }

  const task = await Task.findById(id);
  if (!task) throw new NotFoundError('Task not found');
  // Exact-match ownership. This used to read
  // `task.assigned_to && task.assigned_to !== userId`, so a task with
  // assigned_to IS NULL passed the check and any employee could mark an
  // unassigned task COMPLETED.
  if (task.assigned_to !== userId) {
    throw new AuthorizationError('You are not assigned to this task');
  }

  await Task.update(id, { status });
  await ActivityFeed.create({
    user_id: userId,
    actor_id: userId,
    event_type: 'TASK_STATUS_CHANGED',
    entity_type: 'Task',
    entity_id: id,
    payload: { from: task.status, to: status }
  });
  return success(res, 200, { id, status }, 'Task status updated');
});

export const getMyProjects = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const projects = await ProjectMember.listUserProjects(userId);
  return success(res, 200, projects, 'User projects retrieved');
});

// 5. Learning & Development
export const getEnrolledCourses = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const [rows] = await pool.execute(
    `SELECT e.*, c.name, c.description, c.category, c.level, c.thumbnail_url
     FROM enrollments e
     JOIN courses c ON e.course_id = c.id
     WHERE e.student_id = ?
     ORDER BY e.created_at DESC`,
    [userId]
  );
  return success(res, 200, rows, 'Enrolled courses retrieved');
});

export const getAssignments = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  // Scoped to the caller's own enrolments. The query used to join only
  // `assignments` + `courses` and use the user id solely for the submission
  // LEFT JOIN, so every employee saw the assignments of every course in the
  // system - including courses they were never enrolled in.
  const [rows] = await pool.execute(
    `SELECT a.*, c.name as course_title,
            s.id as submission_id,
             CASE WHEN s.id IS NOT NULL THEN 'SUBMITTED' ELSE 'NOT_STARTED' END as submission_status,
             s.grade, s.feedback, s.submitted_at
     FROM assignments a
     JOIN courses c ON a.course_id = c.id
     JOIN enrollments e ON e.course_id = c.id AND e.student_id = ?
     LEFT JOIN assignment_submissions s ON a.id = s.assignment_id AND s.student_id = ?
     ORDER BY a.due_date ASC`,
    [userId, userId]
  );
  return success(res, 200, rows, 'Assignments retrieved');
});

// 6. Personal Records (Documents, Payslips, Profile)
export const getPersonalDocuments = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const emp = await Employee.findByUserId(userId);
  if (!emp) return success(res, 200, [], 'No employee profile associated');

  const docs = await EmployeeDocument.list({ employee_id: emp.id });
  return success(res, 200, docs, 'Employee documents retrieved');
});

export const uploadPersonalDocument = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const emp = await Employee.findByUserId(userId);
  if (!emp) throw new BadRequestError('No employee profile associated with this user');

  const { document_type, title, file_url, file_size_bytes, mime_type } = req.body;
  if (!document_type || !title || !file_url) {
    throw new BadRequestError('document_type, title, and file_url are required');
  }

  if (!DOCUMENT_TYPES.includes(document_type)) {
    throw new BadRequestError(`Invalid document_type. Must be one of: ${DOCUMENT_TYPES.join(', ')}`);
  }

  const id = await EmployeeDocument.create({
    employee_id: emp.id,
    document_type,
    title,
    file_url,
    file_size_bytes,
    mime_type,
    uploaded_by: userId,
    status: 'PENDING'
  });

  return success(res, 201, { id }, 'Document uploaded successfully');
});

export const getMyPayslips = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const emp = await Employee.findByUserId(userId);
  if (!emp) return success(res, 200, [], 'No employee profile associated');

  const payslips = await Payroll.list({ employee_id: emp.id });
  return success(res, 200, payslips, 'Payslips retrieved');
});

export const getMyProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const [user, emp] = await Promise.all([
    User.findById(userId),
    Employee.findByUserId(userId)
  ]);

  if (!user) throw new NotFoundError('User not found');

  return success(res, 200, {
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      role: user.role,
      avatar_url: user.avatar_url,
      created_at: user.created_at
    },
    employee: emp
  }, 'Profile retrieved');
});

export const updateMyProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { phone, full_name, preferences, avatar_url, avatar } = req.body;
  const updates = {};

  // PAN / PF / bank / employment fields belong to HR, Finance and Admin. Refuse
  // the request outright instead of quietly ignoring it, so an employee (or a
  // script using an employee token) cannot probe for a writable payroll field.
  const attemptedProtected = PROTECTED_EMPLOYEE_FIELDS.filter((field) =>
    Object.prototype.hasOwnProperty.call(req.body || {}, field)
  );
  if (attemptedProtected.length > 0) {
    throw new AuthorizationError(
      `These fields are managed by HR/Finance and cannot be changed from the employee portal: ${attemptedProtected.join(', ')}`
    );
  }

  // Validated here rather than left to the database. encrypt() returns null for
  // a falsy value, so an empty full_name previously wrote NULL into
  // users.full_name (NOT NULL) and surfaced as a 500 rather than a 400.
  if (full_name !== undefined) {
    if (typeof full_name !== 'string' || !full_name.trim()) {
      throw new BadRequestError('full_name cannot be empty');
    }
    if (full_name.trim().length > 255) {
      throw new BadRequestError('full_name must be 255 characters or fewer');
    }
    updates.full_name = full_name.trim();
  }

  if (phone !== undefined && phone !== null && phone !== '') {
    if (typeof phone !== 'string' || phone.trim().length > 255) {
      throw new BadRequestError('phone must be a string of 255 characters or fewer');
    }
    updates.phone = phone.trim();
  }

  if (preferences !== undefined) updates.preferences = preferences;

  const resolvedAvatar = avatar_url !== undefined ? avatar_url : avatar;
  if (resolvedAvatar !== undefined) {
    if (resolvedAvatar === null || resolvedAvatar === '') {
      updates.avatar_url = null;
    } else if (typeof resolvedAvatar !== 'string') {
      throw new BadRequestError('avatar_url must be a string');
    } else if (resolvedAvatar.length > MAX_AVATAR_BYTES) {
      // AvatarUploader posts a base64 data URL; unbounded, a multi-megabyte
      // payload was accepted and stored.
      throw new BadRequestError(
        `avatar_url is too large (${resolvedAvatar.length} characters). Maximum is ${MAX_AVATAR_BYTES}.`
      );
    } else {
      updates.avatar_url = resolvedAvatar;
    }
  }

  if (Object.keys(updates).length === 0) {
    throw new BadRequestError('No supported profile fields were provided');
  }

  await User.update(userId, updates);
  const updatedUser = await User.findById(userId);
  const safeUser = updatedUser ? { ...updatedUser } : null;
  if (safeUser) delete safeUser.password_hash;
  return success(res, 200, safeUser, 'Profile updated successfully');
});

// 7. Support Tickets & Help Desk
export const getSupportTickets = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const tickets = await SupportTicket.list({ user_id: userId });
  return success(res, 200, tickets, 'Support tickets retrieved');
});

export const createSupportTicket = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { category, priority = 'MEDIUM', subject, description, attachment_url } = req.body;

  if (!category || !subject || !description) {
    throw new BadRequestError('category, subject, and description are required');
  }

  if (!SUPPORT_CATEGORIES.includes(category)) {
    throw new BadRequestError(`Invalid category. Must be one of: ${SUPPORT_CATEGORIES.join(', ')}`);
  }

  if (!SUPPORT_PRIORITIES.includes(priority)) {
    throw new BadRequestError(`Invalid priority. Must be one of: ${SUPPORT_PRIORITIES.join(', ')}`);
  }

  const result = await SupportTicket.create({
    user_id: userId,
    category,
    priority,
    subject,
    description,
    attachment_url
  });

  // Feed row so the ticket shows up in the employee's Notifications page.
  await ActivityFeed.create({
    user_id: userId,
    actor_id: userId,
    event_type: 'SUPPORT_TICKET_CREATED',
    entity_type: 'Support',
    entity_id: result?.id || null,
    payload: {
      ticket_number: result?.ticket_number,
      category,
      priority,
      subject
    }
  });

  return success(res, 201, result, 'Support ticket created successfully');
});

// 8. Communication & Governance
export const getAnnouncements = asyncHandler(async (req, res) => {
  const [rows] = await pool.execute(
    `SELECT id, sender, subject, content, created_at 
     FROM communication_logs 
     WHERE channel = 'ANNOUNCEMENT' 
     ORDER BY created_at DESC 
     LIMIT 50`
  );
  return success(res, 200, rows, 'Announcements retrieved');
});

export const getMyApprovals = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const [myRequests, pendingForMe] = await Promise.all([
    pool.execute(
      `SELECT ai.*, ac.name as chain_name 
       FROM approval_instances ai 
       LEFT JOIN approval_chains ac ON ai.workflow_id = ac.workflow_id AND ai.current_step = ac.step_order 
       WHERE ai.initiated_by = ? 
       ORDER BY ai.created_at DESC`,
      [userId]
    ).then(([rows]) => rows),
    pool.execute(
      `SELECT ai.*, ac.name as chain_name, u.full_name as initiator_name 
       FROM approval_instances ai 
       LEFT JOIN approval_chains ac ON ai.workflow_id = ac.workflow_id AND ai.current_step = ac.step_order 
       LEFT JOIN users u ON ai.initiated_by = u.id 
       WHERE ai.status = 'PENDING' 
       ORDER BY ai.created_at DESC`,
    ).then(([rows]) => rows)
  ]);

  return success(res, 200, {
    myRequests,
    pendingForMe: req.user.role === 'ADMIN' || req.user.role === 'SUPER_ADMIN' ? pendingForMe : []
  }, 'Approvals retrieved');
});

export const getAchievements = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const badges = await UserBadge.findByUserId(userId);
  return success(res, 200, badges, 'Achievements and badges retrieved');
});

export const getMessages = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { channel_name, other_user_id } = req.query;
  const msgs = await Message.listUserMessages(userId, { channel_name, other_user_id });
  return success(res, 200, msgs, 'Messages retrieved');
});

/**
 * List users the signed-in employee may message directly.
 *
 * The employee portal used to expose three hard-coded channels and no way to
 * address a person, which effectively limited the employee to talking into
 * voids. `messages` already supports `recipient_id`, so this exposes the
 * existing directory (active users other than yourself) without inventing a
 * new permission model or granting any extra role rights.
 */
export const getMessageContacts = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { search, role, limit = 100 } = req.query;

  const values = [userId];
  let where = 'WHERE u.is_active = 1 AND u.id <> ?';
  if (role) { where += ' AND u.role = ?'; values.push(role); }
  if (search) { where += ' AND (u.full_name LIKE ? OR u.email LIKE ?)'; values.push(`%${search}%`, `%${search}%`); }

  values.push(Math.min(200, Math.max(1, parseInt(limit, 10) || 100)));

  const [rows] = await pool.execute(
    `SELECT u.id, u.email, u.full_name, u.role, u.avatar_url, e.designation, e.department
     FROM users u
     LEFT JOIN employees e ON e.user_id = u.id
     ${where}
     ORDER BY u.role ASC, u.full_name ASC
     LIMIT ?`,
    values
  );

  // users.full_name and users.email are encrypted at rest, so they must
  // be decrypted here — otherwise the Messages page renders the ciphertext
  // (a random hex string) as the contact name and thread title.
  const contacts = rows.map((r) => ({
    id: r.id,
    email: r.email ? decrypt(r.email) : null,
    full_name: r.full_name ? decrypt(r.full_name) : null,
    role: r.role,
    avatar_url: r.avatar_url,
    designation: r.designation || null,
    department: r.department || null,
  }));

  return success(res, 200, contacts, 'Message contacts retrieved');
});

export const sendMessage = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { recipient_id, channel_name, message_content, attachment_url } = req.body;

  if (!message_content || !String(message_content).trim()) {
    throw new BadRequestError('message_content is required');
  }

  // Validate the recipient actually exists and is an active user, so messages
  // cannot be addressed to a bogus/inactive id.
  if (recipient_id) {
    const [rows] = await pool.execute(
      'SELECT id FROM users WHERE id = ? AND is_active = 1 LIMIT 1',
      [recipient_id]
    );
    if (rows.length === 0) {
      throw new BadRequestError('recipient_id is not a valid active user');
    }
    if (recipient_id === userId) {
      throw new BadRequestError('You cannot send a message to yourself');
    }
  }

  const msg = await Message.create({
    sender_id: userId,
    recipient_id: recipient_id || null,
    channel_name: channel_name || null,
    message_content: String(message_content).trim(),
    attachment_url: attachment_url || null
  });

  return success(res, 201, msg, 'Message sent');
});
