import pool from '../config/database.js';
import AuditLog from '../models/AuditLog.js';
import VisitorLog from '../models/VisitorLog.js';
import ReceptionAppointment from '../models/ReceptionAppointment.js';
import ReceptionReceipt from '../models/ReceptionReceipt.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import { decrypt } from '../config/encryption.js';

// ==========================================
// 1. RECEPTION DASHBOARD & OVERVIEW
// ==========================================

export const getDashboardSummary = asyncHandler(async (req, res) => {
  // 1. Today's visitors stats
  const visitorStats = await VisitorLog.getTodayStats();

  // 2. Today's appointments
  const todayAppointments = await ReceptionAppointment.getTodayAppointments();

  // 3. Today's inquiries
  const [inquiryStats] = await pool.query(`
    SELECT 
      COUNT(*) as total_inquiries,
      COUNT(CASE WHEN DATE(created_at) = CURRENT_DATE THEN 1 END) as today_inquiries
    FROM contact_inquiries
  `);

  // 4. Counter receipt revenue stats
  const receiptStats = await ReceptionReceipt.getSummaryStats();

  // 5. Active student admissions count
  const [enrollmentStats] = await pool.query(`
    SELECT COUNT(*) as total_admissions FROM enrollments
  `);

  // 6. Recent visitor logs
  const [recentVisitors] = await pool.query(`
    SELECT id, visitor_name, phone, company, purpose, person_to_meet_name, badge_number, status, check_in_time
    FROM visitor_logs
    ORDER BY check_in_time DESC
    LIMIT 6
  `);

  return success(res, 200, {
    visitors: {
      total_today: visitorStats.total_today || 0,
      checked_in: visitorStats.checked_in || 0,
      checked_out: visitorStats.checked_out || 0
    },
    appointments: {
      scheduled_today: todayAppointments.length,
      upcoming: todayAppointments.slice(0, 5)
    },
    inquiries: {
      total: inquiryStats[0]?.total_inquiries || 0,
      today: inquiryStats[0]?.today_inquiries || 0
    },
    admissions: {
      total: enrollmentStats[0]?.total_admissions || 0
    },
    receipts: receiptStats,
    recent_visitors: recentVisitors
  }, 'Reception dashboard summary retrieved');
});

// ==========================================
// 2. APPOINTMENTS MANAGEMENT
// ==========================================

export const listAppointments = asyncHandler(async (req, res) => {
  const { status, appointment_date, person_to_meet, search, page = 1, limit = 50 } = req.query;

  const appointments = await ReceptionAppointment.list({
    status,
    appointment_date,
    person_to_meet,
    search,
    page,
    limit
  });

  const total = await ReceptionAppointment.count({
    status,
    appointment_date,
    person_to_meet,
    search
  });

  return success(res, 200, {
    items: appointments,
    total,
    page: parseInt(page, 10),
    limit: parseInt(limit, 10)
  }, 'Appointments retrieved successfully');
});

export const getAppointment = asyncHandler(async (req, res) => {
  const appointment = await ReceptionAppointment.findById(req.params.id);
  if (!appointment) throw new NotFoundError('Appointment not found');
  return success(res, 200, appointment, 'Appointment retrieved');
});

export const createAppointment = asyncHandler(async (req, res) => {
  const { visitor_name, phone, purpose, appointment_date, appointment_time } = req.body;
  if (!visitor_name || !phone || !purpose || !appointment_date || !appointment_time) {
    throw new ValidationError('Visitor name, phone, purpose, appointment date, and time are required');
  }

  const newAppt = await ReceptionAppointment.create(req.body);

  await AuditLog.log({
    userId: req.user?.id,
    action: 'CREATE',
    entityType: 'RECEPTION_APPOINTMENT',
    entityId: newAppt.id,
    details: { visitor_name: newAppt.visitor_name, date: newAppt.appointment_date },
    ipAddress: req.ip
  });

  broadcastToRole('RECEPTION', 'appointment:created', newAppt);
  return success(res, 201, newAppt, 'Appointment scheduled successfully');
});

export const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status, badge_number } = req.body;
  if (!status) throw new ValidationError('Status is required');

  const existing = await ReceptionAppointment.findById(req.params.id);
  if (!existing) throw new NotFoundError('Appointment not found');

  const updated = await ReceptionAppointment.updateStatus(req.params.id, status, badge_number);

  // If status moved to CHECKED_IN, automatically log into visitor_logs
  if (status === 'CHECKED_IN' && existing.status !== 'CHECKED_IN') {
    await VisitorLog.create({
      visitor_name: existing.visitor_name,
      phone: existing.phone,
      email: existing.email,
      company: existing.company,
      purpose: existing.purpose,
      person_to_meet: existing.person_to_meet,
      person_to_meet_name: existing.person_to_meet_name,
      badge_number: badge_number || existing.badge_number || 'V-APPT'
    });
  }

  broadcastToRole('RECEPTION', 'appointment:status_changed', updated);
  return success(res, 200, updated, 'Appointment status updated successfully');
});

export const deleteAppointment = asyncHandler(async (req, res) => {
  const existing = await ReceptionAppointment.findById(req.params.id);
  if (!existing) throw new NotFoundError('Appointment not found');

  await ReceptionAppointment.delete(req.params.id);
  return success(res, 200, { id: req.params.id }, 'Appointment cancelled and removed');
});

// ==========================================
// 3. FRONT DESK RECEIPTS & FEES
// ==========================================

export const listReceipts = asyncHandler(async (req, res) => {
  const { student_id, purpose, payment_mode, page = 1, limit = 50 } = req.query;

  const receipts = await ReceptionReceipt.list({
    student_id,
    purpose,
    payment_mode,
    page,
    limit
  });

  const total = await ReceptionReceipt.count({
    student_id,
    purpose,
    payment_mode
  });

  return success(res, 200, {
    items: receipts,
    total,
    page: parseInt(page, 10),
    limit: parseInt(limit, 10)
  }, 'Receipts retrieved successfully');
});

export const getReceipt = asyncHandler(async (req, res) => {
  const receipt = await ReceptionReceipt.findById(req.params.id);
  if (!receipt) throw new NotFoundError('Receipt not found');
  return success(res, 200, receipt, 'Receipt retrieved');
});

export const createReceipt = asyncHandler(async (req, res) => {
  const { student_name, amount, payment_mode, purpose } = req.body;
  if (!student_name || !amount) {
    throw new ValidationError('Student/Payer name and amount are required');
  }

  const receiptData = {
    ...req.body,
    issued_by: req.user?.id
  };

  const newReceipt = await ReceptionReceipt.create(receiptData);

  await AuditLog.log({
    userId: req.user?.id,
    action: 'CREATE',
    entityType: 'RECEPTION_RECEIPT',
    entityId: newReceipt.id,
    details: { receipt_number: newReceipt.receipt_number, amount: newReceipt.amount },
    ipAddress: req.ip
  });

  broadcastToRole('FINANCE', 'receipt:issued', newReceipt);
  return success(res, 201, newReceipt, 'Payment receipt generated successfully');
});

export const getReceiptStats = asyncHandler(async (req, res) => {
  const stats = await ReceptionReceipt.getSummaryStats();
  return success(res, 200, stats, 'Receipt summary statistics retrieved');
});

// ==========================================
// 4. FRONT DESK DIRECTORY SEARCH
// ==========================================

export const searchDirectory = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim().length < 2) {
    return success(res, 200, { employees: [], students: [], interns: [] }, 'Query too short');
  }

  const term = `%${q.trim()}%`;

  // Search staff/employees
  const [employees] = await pool.query(`
    SELECT id, full_name, email, phone, role
    FROM users
    WHERE role IN ('EMPLOYEE', 'HR', 'ADMIN', 'TUTOR', 'PROJECT_MANAGER')
      AND (email LIKE ? OR full_name LIKE ? OR phone LIKE ?)
    LIMIT 10
  `, [term, term, term]);

  // Search students
  const [students] = await pool.query(`
    SELECT u.id, u.full_name, u.email, u.phone, e.status as enrollment_status, c.title as course_title
    FROM users u
    LEFT JOIN enrollments e ON e.student_id = u.id
    LEFT JOIN courses c ON e.course_id = c.id
    WHERE u.role = 'STUDENT'
      AND (u.email LIKE ? OR u.full_name LIKE ? OR u.phone LIKE ?)
    LIMIT 10
  `, [term, term, term]);

  // Search interns
  const [interns] = await pool.query(`
    SELECT id, full_name, email, phone
    FROM users
    WHERE role = 'INTERN'
      AND (email LIKE ? OR full_name LIKE ? OR phone LIKE ?)
    LIMIT 10
  `, [term, term, term]);

  return success(res, 200, {
    employees: employees.map(e => ({ ...e, full_name: e.full_name ? decrypt(e.full_name) : e.email })),
    students: students.map(s => ({ ...s, full_name: s.full_name ? decrypt(s.full_name) : s.email })),
    interns: interns.map(i => ({ ...i, full_name: i.full_name ? decrypt(i.full_name) : i.email }))
  }, 'Directory search results');
});

// ==========================================
// 5. REPORTS & FOOTFALL ANALYTICS
// ==========================================

export const getReceptionAnalytics = asyncHandler(async (req, res) => {
  // 1. Daily visitor volume (last 7 days)
  const [footfallRows] = await pool.query(`
    SELECT 
      DATE(check_in_time) as date,
      COUNT(*) as total_visitors,
      COUNT(CASE WHEN status = 'CHECKED_IN' THEN 1 END) as checked_in,
      COUNT(CASE WHEN status = 'CHECKED_OUT' THEN 1 END) as checked_out
    FROM visitor_logs
    WHERE check_in_time >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY)
    GROUP BY DATE(check_in_time)
    ORDER BY date ASC
  `);

  // 2. Visitors grouped by purpose
  const [purposeRows] = await pool.query(`
    SELECT purpose, COUNT(*) as count
    FROM visitor_logs
    GROUP BY purpose
    ORDER BY count DESC
    LIMIT 6
  `);

  // 3. Enquiry to admission stats
  const [conversionRows] = await pool.query(`
    SELECT 
      (SELECT COUNT(*) FROM contact_inquiries) as total_inquiries,
      (SELECT COUNT(*) FROM enrollments) as total_admissions,
      (SELECT COALESCE(SUM(amount), 0) FROM reception_receipts) as total_counter_revenue
  `);

  return success(res, 200, {
    footfall_trends: footfallRows,
    visitor_purposes: purposeRows,
    conversion_metrics: conversionRows[0] || {}
  }, 'Reception analytics retrieved successfully');
});
