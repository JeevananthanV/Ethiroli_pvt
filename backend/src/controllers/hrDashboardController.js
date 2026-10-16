import pool from '../config/database.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';

export const getDashboardMetrics = asyncHandler(async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);

  // Run parallel aggregate queries for high performance real data
  const [
    [employeeRows],
    [internRows],
    [studentRows],
    [leaveTodayRows],
    [attendanceTodayRows],
    [pendingLeavesRows],
    [openJobsRows],
    [interviewRows],
    [careerAppRows],
    [contactMsgRows],
    [newJoinerRows],
    [pendingOnboardingRows]
  ] = await Promise.all([
    pool.execute('SELECT COUNT(*) as total FROM employees e JOIN users u ON e.user_id = u.id WHERE u.is_active = TRUE'),
    pool.execute('SELECT COUNT(*) as total FROM interns i JOIN users u ON i.user_id = u.id WHERE u.is_active = TRUE'),
    pool.execute('SELECT COUNT(*) as total FROM users WHERE role = "STUDENT" AND is_active = TRUE'),
    pool.execute('SELECT COUNT(*) as total FROM leaves l JOIN users u ON l.user_id = u.id WHERE l.status = "APPROVED" AND ? BETWEEN l.start_date AND l.end_date', [today]),
    pool.execute('SELECT COUNT(DISTINCT user_id) as total FROM attendance WHERE date = ? AND status IN ("PRESENT", "ON_TIME", "LATE")', [today]),
    pool.execute('SELECT COUNT(*) as total FROM leaves l JOIN users u ON l.user_id = u.id WHERE l.status = "PENDING"'),
    pool.execute('SELECT COUNT(*) as total FROM jobs WHERE status = "OPEN"').catch(() => [[{ total: 0 }]]),
    pool.execute('SELECT COUNT(*) as total FROM interviews WHERE status = "SCHEDULED" AND scheduled_at >= ?', [today]).catch(() => [[{ total: 0 }]]),
    pool.query('SELECT COUNT(*) as total FROM career_applications').catch(() => [[{ total: 0 }]]),
    pool.query('SELECT COUNT(*) as total FROM contact_messages').catch(() => [[{ total: 0 }]]),
    pool.execute('SELECT COUNT(*) as total FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) AND role IN ("EMPLOYEE", "INTERN")'),
    pool.execute('SELECT COUNT(*) as total FROM interns WHERE progress < 20').catch(() => [[{ total: 0 }]])
  ]);

  const totalEmployees = employeeRows[0]?.total || 0;
  const totalInterns = internRows[0]?.total || 0;
  const totalStudents = studentRows[0]?.total || 0;
  const totalWorkforce = totalEmployees + totalInterns;

  const metrics = {
    totalEmployees,
    totalInterns,
    totalStudents,
    totalWorkforce,
    newJoiners: newJoinerRows[0]?.total || 0,
    pendingOnboarding: pendingOnboardingRows[0]?.total || 0,
    interviewsToday: interviewRows[0]?.total || 0,
    upcomingInterviews: interviewRows[0]?.total || 0,
    documentsPending: 0,
    reviewsDue: 0,
    onLeaveToday: leaveTodayRows[0]?.total || 0,
    presentToday: attendanceTodayRows[0]?.total || 0,
    pendingLeaves: pendingLeavesRows[0]?.total || 0,
    openJobs: openJobsRows[0]?.total || 0,
    totalApplications: careerAppRows[0]?.total || 0,
    totalInquiries: contactMsgRows[0]?.total || 0,
    timestamp: new Date().toISOString()
  };

  return success(res, 200, metrics, 'HR dashboard metrics retrieved successfully');
});

export default {
  getDashboardMetrics
};
