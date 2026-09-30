import pool from '../backend/src/config/database.js';

async function main() {
  try {
    const [c] = await pool.query("SHOW TABLES LIKE 'career_applications'");
    const [m2] = await pool.query("SHOW TABLES LIKE 'contact_messages'");
    console.log({ career_applications: c.length > 0, contact_messages: m2.length > 0 });

    const today = new Date().toISOString().slice(0, 10);
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
      pool.execute('SELECT COUNT(*) as total FROM leaves WHERE status = "APPROVED" AND ? BETWEEN start_date AND end_date', [today]),
      pool.execute('SELECT COUNT(*) as total FROM attendance WHERE date = ? AND status = "PRESENT"', [today]),
      pool.execute('SELECT COUNT(*) as total FROM leaves WHERE status = "PENDING"'),
      pool.execute('SELECT COUNT(*) as total FROM jobs WHERE status = "OPEN"'),
      pool.execute('SELECT COUNT(*) as total FROM interviews WHERE status = "SCHEDULED" AND scheduled_at >= ?', [today]),
      pool.query('SELECT COUNT(*) as total FROM career_applications'),
      pool.query('SELECT COUNT(*) as total FROM contact_messages')
    ]);

    console.log('Query successful:', {
      totalEmployees: employeeRows[0]?.total,
      totalInterns: internRows[0]?.total,
      onLeaveToday: leaveTodayRows[0]?.total,
      presentToday: attendanceTodayRows[0]?.total,
      pendingLeaves: pendingLeavesRows[0]?.total,
      openJobs: openJobsRows[0]?.total,
      upcomingInterviews: upcomingInterviewsRows[0]?.total,
      totalApplications: careerAppRows[0]?.total,
      totalInquiries: contactMsgRows[0]?.total
    });
  } catch (err) {
    console.error('Error during query:', err);
  } finally {
    process.exit(0);
  }
}

main();
