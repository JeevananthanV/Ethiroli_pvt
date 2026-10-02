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
    return {
      ...r,
      work_date: workDate,
      session_count: hasSessions ? sessions.length : Number(r.session_count || 0),
      sessions,
      has_sessions: hasSessions,
      // True worked time (excludes breaks) when sessions exist.
      worked_minutes: hasSessions ? day?.worked_minutes ?? 0 : Math.round(Number(r.total_hours || 0) * 60),
      worked_hours: hasSessions
        ? Number(((day?.worked_minutes ?? 0) / 60).toFixed(2))
        : Number(r.total_hours || 0),
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

// 3. Leaves & Balances
export const getLeavesAndBalances = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const currentYear = new Date().getFullYear().toString();

  const [balances, leaves] = await Promise.all([
    pool.execute('SELECT * FROM leave_balances WHERE user_id = ?', [userId]).then(([rows]) => rows),
    Leave.list({ user_id: userId, limit: 100 })
  ]);

  // Only balances that actually exist are returned. This endpoint previously
  // substituted invented 12 / 8 / 15-day balances when leave_balances was
  // empty, presenting a fabricated entitlement as a real one.
  return success(res, 200, {
    balances,
    requests: leaves,
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

  const [tasks, total] = await Promise.all([
    Task.list({ assigned_to: userId, status, limit: parseInt(limit), offset }),
    Task.count({ assigned_to: userId, status })
  ]);

  return success(res, 200, tasks, 'Assigned tasks retrieved', {
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

  const contacts = rows.map((r) => ({
    id: r.id,
    email: r.email,
    full_name: r.full_name,
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
