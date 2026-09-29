import pool from '../config/database.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';

export const getDashboardMetrics = asyncHandler(async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);

  // Run parallel aggregate queries for high performance
  const [
    [employeeRows],
    [internRows],
    [leaveTodayRows],
    [attendanceTodayRows],
    [pendingLeavesRows],
    [openJobsRows],
    [upcomingInterviewsRows],
    [careerAppRows],
    [contactMsgRows]
  ] = await Promise.all([
    pool.execute('SELECT COUNT(*) as total FROM employees e JOIN users u ON e.user_id = u.id WHERE u.is_active = TRUE'),
    pool.execute('SELECT COUNT(*) as total FROM interns i JOIN users u ON i.user_id = u.id WHERE u.is_active = TRUE'),
    pool.execute('SELECT COUNT(*) as total FROM leaves l JOIN employees e ON l.user_id = e.user_id WHERE l.status = "APPROVED" AND ? BETWEEN l.start_date AND l.end_date', [today]),
    pool.execute('SELECT COUNT(*) as total FROM attendance a JOIN employees e ON a.user_id = e.user_id WHERE a.date = ? AND a.status = "PRESENT"', [today]),
    pool.execute('SELECT COUNT(*) as total FROM leaves l JOIN users u ON l.user_id = u.id WHERE l.status = "PENDING"'),
    pool.execute('SELECT COUNT(*) as total FROM jobs WHERE status = "OPEN"'),
    pool.execute('SELECT COUNT(*) as total FROM interviews WHERE status = "SCHEDULED" AND scheduled_at >= ?', [today]),
    pool.query('SELECT COUNT(*) as total FROM career_applications'),
    pool.query('SELECT COUNT(*) as total FROM contact_messages')
  ]);

  const metrics = {
    totalEmployees: employeeRows[0]?.total || 0,
    totalInterns: internRows[0]?.total || 0,
    onLeaveToday: leaveTodayRows[0]?.total || 0,
    presentToday: attendanceTodayRows[0]?.total || 0,
    pendingLeaves: pendingLeavesRows[0]?.total || 0,
    openJobs: openJobsRows[0]?.total || 0,
    upcomingInterviews: upcomingInterviewsRows[0]?.total || 0,
    totalApplications: careerAppRows[0]?.total || 0,
    totalInquiries: contactMsgRows[0]?.total || 0,
    timestamp: new Date().toISOString()
  };

  return success(res, 200, metrics, 'HR dashboard metrics retrieved successfully');
});

export default {
  getDashboardMetrics
};
