import VisitorLog from '../models/VisitorLog.js';
import Timesheet from '../models/Timesheet.js';
import pool from '../config/database.js';
import { decrypt } from '../config/encryption.js';

// ==========================================
// 1. VISITOR LOGS (Reception)
// ==========================================

export const listVisitors = async (req, res) => {
  try {
    const { status, search, limit = 50, offset = 0 } = req.query;
    const visitors = await VisitorLog.list({
      status,
      search,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10)
    });
    const total = await VisitorLog.count({ status });
    const stats = await VisitorLog.getTodayStats();

    res.json({ success: true, visitors, total, stats });
  } catch (error) {
    console.error('listVisitors error:', error);
    res.status(500).json({ error: 'Failed to fetch visitor logs' });
  }
};

export const createVisitor = async (req, res) => {
  try {
    const { visitor_name, phone, email, company, purpose, person_to_meet, person_to_meet_name, badge_number, notes } = req.body;
    if (!visitor_name || !phone || !purpose) {
      return res.status(400).json({ error: 'Visitor name, phone, and purpose are required' });
    }

    const result = await VisitorLog.create({
      visitor_name,
      phone,
      email,
      company,
      purpose,
      person_to_meet,
      person_to_meet_name,
      badge_number,
      notes
    });

    const visitor = await VisitorLog.findById(result.id);
    res.status(201).json({ success: true, visitor });
  } catch (error) {
    console.error('createVisitor error:', error);
    res.status(500).json({ error: 'Failed to record visitor entry' });
  }
};

export const checkoutVisitor = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await VisitorLog.checkOut(id);
    if (!updated) {
      return res.status(404).json({ error: 'Visitor record not found' });
    }
    res.json({ success: true, visitor: updated });
  } catch (error) {
    console.error('checkoutVisitor error:', error);
    res.status(500).json({ error: 'Failed to checkout visitor' });
  }
};

export const deleteVisitor = async (req, res) => {
  try {
    const { id } = req.params;
    await VisitorLog.delete(id);
    res.json({ success: true, message: 'Visitor record removed' });
  } catch (error) {
    console.error('deleteVisitor error:', error);
    res.status(500).json({ error: 'Failed to delete visitor record' });
  }
};

// ==========================================
// 2. TIMESHEETS (Project Manager & Team)
// ==========================================

export const listTimesheets = async (req, res) => {
  try {
    const { user_id, project_id, status, start_date, end_date, limit = 50, offset = 0 } = req.query;
    
    // Non-managers can only view their own timesheets unless authorized
    const targetUserId = req.user.role === 'PROJECT_MANAGER' || req.user.role === 'ADMIN' || req.user.role === 'SUPER_ADMIN'
      ? user_id
      : req.user.id;

    const timesheets = await Timesheet.list({
      user_id: targetUserId,
      project_id,
      status,
      start_date,
      end_date,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10)
    });
    const total = await Timesheet.count({ user_id: targetUserId, project_id, status });
    const summary = await Timesheet.getSummary({ user_id: targetUserId, project_id });

    res.json({ success: true, timesheets, total, summary });
  } catch (error) {
    console.error('listTimesheets error:', error);
    res.status(500).json({ error: 'Failed to fetch timesheets' });
  }
};

export const createTimesheet = async (req, res) => {
  try {
    const { project_id, task_id, work_date, hours_spent, description } = req.body;
    if (!work_date || !hours_spent || !description) {
      return res.status(400).json({ error: 'Work date, hours spent, and description are required' });
    }

    const result = await Timesheet.create({
      user_id: req.user.id,
      project_id,
      task_id,
      work_date,
      hours_spent: parseFloat(hours_spent),
      description,
      status: 'SUBMITTED'
    });

    const timesheet = await Timesheet.findById(result.id);
    res.status(201).json({ success: true, timesheet });
  } catch (error) {
    console.error('createTimesheet error:', error);
    res.status(500).json({ error: 'Failed to log timesheet' });
  }
};

export const approveTimesheet = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Timesheet.approve(id, req.user.id);
    if (!updated) {
      return res.status(404).json({ error: 'Timesheet record not found' });
    }
    res.json({ success: true, timesheet: updated });
  } catch (error) {
    console.error('approveTimesheet error:', error);
    res.status(500).json({ error: 'Failed to approve timesheet' });
  }
};

export const rejectTimesheet = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejection_reason } = req.body;
    const updated = await Timesheet.reject(id, req.user.id, rejection_reason || 'Revision required');
    if (!updated) {
      return res.status(404).json({ error: 'Timesheet record not found' });
    }
    res.json({ success: true, timesheet: updated });
  } catch (error) {
    console.error('rejectTimesheet error:', error);
    res.status(500).json({ error: 'Failed to reject timesheet' });
  }
};

// ==========================================
// 3. CRM & SALES OPERATIONS (Sales)
// ==========================================

export const getSalesOverview = async (req, res) => {
  try {
    // Aggregate closed/won deals into stage buckets & metrics
    const [leads] = await pool.execute(`
      SELECT 
        s.stage,
        COUNT(*) as count,
        COALESCE(SUM(s.deal_value), 0) as total_value
      FROM sales_deals s
      GROUP BY s.stage
    `);

    const [recentLeads] = await pool.execute(`
      SELECT l.*, u.full_name as assigned_to_name
      FROM leads l
      LEFT JOIN users u ON l.assigned_to = u.id
      ORDER BY l.created_at DESC
      LIMIT 10
    `);

    // Decrypt names in recent leads
    const formattedLeads = recentLeads.map(l => ({
      ...l,
      name: l.name ? decrypt(l.name) : 'Contact',
      email: l.email ? decrypt(l.email) : null,
      phone: l.phone ? decrypt(l.phone) : null,
      assigned_to_name: l.assigned_to_name ? decrypt(l.assigned_to_name) : 'Unassigned'
    }));

    res.json({
      success: true,
      stageCounts: leads,
      recentOpportunities: formattedLeads
    });
  } catch (error) {
    console.error('getSalesOverview error:', error);
    res.status(500).json({ error: 'Failed to get sales metrics' });
  }
};

// ==========================================
// 4. COMMERCIAL FINANCE OPERATIONS (Finance)
// ==========================================

export const getFinanceOverview = async (req, res) => {
  try {
    // Invoices summary (Receivables)
    const [invoiceStats] = await pool.execute(`
      SELECT 
        COUNT(*) as total_invoices,
        COALESCE(SUM(CASE WHEN status = 'PAID' THEN total ELSE 0 END), 0) as paid_amount,
        COALESCE(SUM(CASE WHEN status IN ('SENT', 'OVERDUE') THEN total ELSE 0 END), 0) as receivable_amount,
        COALESCE(SUM(CASE WHEN status = 'OVERDUE' THEN total ELSE 0 END), 0) as overdue_amount,
        COALESCE(SUM(gst_amount), 0) as total_tax_collected
      FROM invoices
    `);

    // Transactions summary (Income vs Expense)
    const [transactionStats] = await pool.execute(`
      SELECT 
        type,
        COUNT(*) as count,
        COALESCE(SUM(amount), 0) as total_sum,
        COALESCE(SUM(gst_amount), 0) as gst_sum
      FROM transactions
      GROUP BY type
    `);

    // Clients list
    const [clients] = await pool.execute(`
      SELECT c.*, 
        (SELECT COUNT(*) FROM subscriptions s WHERE s.client_id = c.id AND s.is_active = TRUE) as active_subscriptions,
        (SELECT COALESCE(SUM(total), 0) FROM invoices i WHERE i.client_id = c.id AND i.status = 'PAID') as lifetime_value
      FROM clients c
      ORDER BY c.created_at DESC
      LIMIT 50
    `);

    res.json({
      success: true,
      invoices: invoiceStats[0] || {},
      transactions: transactionStats,
      clients
    });
  } catch (error) {
    console.error('getFinanceOverview error:', error);
    res.status(500).json({ error: 'Failed to fetch financial summary' });
  }
};

// ==========================================
// 5. RECEPTION & FRONT DESK ADMISSIONS
// ==========================================

export const getReceptionOverview = async (req, res) => {
  try {
    const todayVisitors = await VisitorLog.getTodayStats();
    
    // Inquiries from contact_inquiries or leads
    const [inquiries] = await pool.execute(`
      SELECT * FROM contact_inquiries
      ORDER BY created_at DESC
      LIMIT 20
    `);

    // Recent student admissions / enrollments
    const [admissions] = await pool.execute(`
      SELECT e.id, e.enrolled_at, e.status, e.progress_percentage,
             c.name as course_title,
             u.full_name as student_name, u.email as student_email
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      JOIN users u ON e.student_id = u.id
      ORDER BY e.enrolled_at DESC
      LIMIT 20
    `);

    const formattedAdmissions = admissions.map(a => ({
      ...a,
      student_name: a.student_name ? decrypt(a.student_name) : 'Student'
    }));

    res.json({
      success: true,
      todayVisitors,
      inquiries,
      admissions: formattedAdmissions
    });
  } catch (error) {
    console.error('getReceptionOverview error:', error);
    res.status(500).json({ error: 'Failed to load reception overview' });
  }
};
