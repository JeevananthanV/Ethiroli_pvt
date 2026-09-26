import pool from '../config/database.js';
import Employee from '../models/Employee.js';
import Attendance from '../models/Attendance.js';
import Leave from '../models/Leave.js';
import Task from '../models/Task.js';
import ProjectMember from '../models/ProjectMember.js';
import SupportTicket from '../models/SupportTicket.js';
import EmployeeDocument from '../models/EmployeeDocument.js';
import Payroll from '../models/Payroll.js';
import User from '../models/User.js';
import UserBadge from '../models/UserBadge.js';
import Message from '../models/Message.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success, error } from '../utils/response.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';

// 1. Dashboard Overview
export const getDashboardOverview = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const today = new Date().toISOString().slice(0, 10);

  const emp = await Employee.findByUserId(userId);
  const employeeId = emp ? emp.id : null;

  // Run queries in parallel
  const [
    [attendanceRows],
    [leaveBalanceRows],
    [taskRows],
    [projectRows],
    [unreadMessagesRows],
    [announcementRows]
  ] = await Promise.all([
    pool.execute('SELECT * FROM attendance WHERE user_id = ? AND date = ?', [userId, today]),
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

  const todayAttendance = attendanceRows.length > 0 ? attendanceRows[0] : null;
  const leaveBalances = leaveBalanceRows.length > 0 ? leaveBalanceRows : [
    { leave_type: 'CASUAL', balance: 12.0, total_credited: 12.0, consumed: 0.0 },
    { leave_type: 'SICK', balance: 8.0, total_credited: 8.0, consumed: 0.0 },
    { leave_type: 'EARNED', balance: 15.0, total_credited: 15.0, consumed: 0.0 }
  ];

  return success(res, 200, {
    employee: emp,
    todayAttendance,
    leaveBalances,
    upcomingTasks: taskRows,
    projectsCount: projectRows[0]?.count || 0,
    unreadMessagesCount: unreadMessagesRows[0]?.count || 0,
    recentAnnouncements: announcementRows
  }, 'Employee dashboard overview retrieved');
});

// 2. Attendance & Punch Clock
export const punchAttendance = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { action } = req.body; // 'CHECK_IN' or 'CHECK_OUT'

  if (action === 'CHECK_IN') {
    await Attendance.checkIn(userId);
    return success(res, 200, { action: 'CHECK_IN', time: new Date() }, 'Checked in successfully');
  } else if (action === 'CHECK_OUT') {
    await Attendance.checkOut(userId);
    return success(res, 200, { action: 'CHECK_OUT', time: new Date() }, 'Checked out successfully');
  } else {
    throw new BadRequestError('Invalid punch action. Must be CHECK_IN or CHECK_OUT');
  }
});

export const getAttendanceHistory = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { start_date, end_date, limit = 50, page = 1 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [records, total] = await Promise.all([
    Attendance.list({ user_id: userId, start_date, end_date, limit: parseInt(limit), offset }),
    Attendance.count({ user_id: userId, start_date, end_date })
  ]);

  return success(res, 200, records, 'Attendance history retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    totalPages: Math.ceil(total / parseInt(limit))
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

  const defaultBalances = [
    { leave_type: 'CASUAL', balance: 12.0, total_credited: 12.0, consumed: 0.0, financial_year: currentYear },
    { leave_type: 'SICK', balance: 8.0, total_credited: 8.0, consumed: 0.0, financial_year: currentYear },
    { leave_type: 'EARNED', balance: 15.0, total_credited: 15.0, consumed: 0.0, financial_year: currentYear }
  ];

  return success(res, 200, {
    balances: balances.length > 0 ? balances : defaultBalances,
    requests: leaves
  }, 'Leaves and balances retrieved');
});

export const applyLeave = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { leave_type, start_date, end_date, reason } = req.body;

  if (!leave_type || !start_date || !end_date || !reason) {
    throw new BadRequestError('leave_type, start_date, end_date, and reason are required');
  }

  const id = await Leave.create({
    user_id: userId,
    leave_type,
    start_date,
    end_date,
    reason
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

  const task = await Task.findById(id);
  if (!task) throw new NotFoundError('Task not found');
  if (task.assigned_to && task.assigned_to !== userId) {
    throw new BadRequestError('Forbidden. You are not assigned to this task');
  }

  await Task.update(id, { status });
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
  const [rows] = await pool.execute(
    `SELECT a.*, c.name as course_title,
            s.id as submission_id,
             CASE WHEN s.id IS NOT NULL THEN 'SUBMITTED' ELSE 'NOT_STARTED' END as submission_status,
             s.grade, s.feedback, s.submitted_at
     FROM assignments a
     JOIN courses c ON a.course_id = c.id
     LEFT JOIN assignment_submissions s ON a.id = s.assignment_id AND s.student_id = ?
     ORDER BY a.due_date ASC`,
    [userId]
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
  const { phone, full_name, preferences } = req.body;

  await User.update(userId, { phone, full_name, preferences });
  return success(res, 200, null, 'Profile updated successfully');
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

  const result = await SupportTicket.create({
    user_id: userId,
    category,
    priority,
    subject,
    description,
    attachment_url
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

export const sendMessage = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { recipient_id, channel_name, message_content, attachment_url } = req.body;

  if (!message_content) {
    throw new BadRequestError('message_content is required');
  }

  const msg = await Message.create({
    sender_id: userId,
    recipient_id: recipient_id || null,
    channel_name: channel_name || null,
    message_content,
    attachment_url: attachment_url || null
  });

  return success(res, 201, msg, 'Message sent');
});
