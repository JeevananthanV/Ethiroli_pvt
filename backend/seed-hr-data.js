import crypto from 'crypto';
import db from './src/config/database.js';
import { encrypt } from './src/config/encryption.js';

async function seedHrData() {
  console.log('--- Seeding Comprehensive HR Data ---');

  // 1. Fetch Users
  const [users] = await db.query('SELECT id, email, role FROM users');
  const userMap = {};
  for (const u of users) {
    userMap[u.role] = u.id;
  }

  const empUserId = userMap['EMPLOYEE'] || userMap['HR'];
  const internUserId = userMap['INTERN'] || userMap['STUDENT'];
  const hrUserId = userMap['HR'] || users[0].id;

  // 2. Check / Seed Employees
  const [existingEmps] = await db.query('SELECT COUNT(*) as count FROM employees');
  if (existingEmps[0].count === 0) {
    console.log('Seeding employees...');
    const employeesToInsert = [
      {
        id: crypto.randomUUID(),
        user_id: empUserId,
        employee_code: 'EMP-101',
        department: 'Engineering',
        designation: 'Senior Full Stack Developer',
        date_of_joining: '2024-03-15',
        pan: encrypt('ABCDE1234F'),
        bank_account: encrypt('HDFC0001234567'),
        pf_number: encrypt('MH/BAN/0012345/101')
      },
      {
        id: crypto.randomUUID(),
        user_id: hrUserId,
        employee_code: 'EMP-102',
        department: 'Human Resources',
        designation: 'HR Lead & Talent Ops',
        date_of_joining: '2023-11-01',
        pan: encrypt('FGHIJ5678K'),
        bank_account: encrypt('ICIC0009876543'),
        pf_number: encrypt('MH/BAN/0012345/102')
      },
      {
        id: crypto.randomUUID(),
        user_id: userMap['PROJECT_MANAGER'] || empUserId,
        employee_code: 'EMP-103',
        department: 'Product',
        designation: 'Technical Project Manager',
        date_of_joining: '2024-01-10',
        pan: encrypt('KLMNO9012P'),
        bank_account: encrypt('SBIN0004567890'),
        pf_number: encrypt('MH/BAN/0012345/103')
      },
      {
        id: crypto.randomUUID(),
        user_id: userMap['FINANCE'] || empUserId,
        employee_code: 'EMP-104',
        department: 'Finance',
        designation: 'Finance & Accounts Specialist',
        date_of_joining: '2024-05-20',
        pan: encrypt('QRSTU3456V'),
        bank_account: encrypt('AXIS0003456789'),
        pf_number: encrypt('MH/BAN/0012345/104')
      },
      {
        id: crypto.randomUUID(),
        user_id: userMap['SALES'] || empUserId,
        employee_code: 'EMP-105',
        department: 'Sales & Growth',
        designation: 'Business Development Executive',
        date_of_joining: '2024-06-01',
        pan: encrypt('WXYZ7890A'),
        bank_account: encrypt('KKBK0001234987'),
        pf_number: encrypt('MH/BAN/0012345/105')
      }
    ];

    for (const emp of employeesToInsert) {
      await db.query(
        `INSERT INTO employees (id, user_id, employee_code, department, designation, date_of_joining, pan, bank_account, pf_number)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [emp.id, emp.user_id, emp.employee_code, emp.department, emp.designation, emp.date_of_joining, emp.pan, emp.bank_account, emp.pf_number]
      );
    }
    console.log(`✅ Seeded ${employeesToInsert.length} employees`);
  }

  // 3. Seed Interns
  const [existingInterns] = await db.query('SELECT COUNT(*) as count FROM interns');
  if (existingInterns[0].count === 0) {
    console.log('Seeding interns...');
    const internsToInsert = [
      {
        id: crypto.randomUUID(),
        user_id: internUserId,
        mentor_id: hrUserId,
        college_name: 'Anna University, Chennai',
        stipend: 15000.00,
        start_date: '2026-06-01',
        end_date: '2026-11-30'
      },
      {
        id: crypto.randomUUID(),
        user_id: userMap['STUDENT'] || internUserId,
        mentor_id: hrUserId,
        college_name: 'PSG College of Technology',
        stipend: 12000.00,
        start_date: '2026-07-01',
        end_date: '2026-12-31'
      }
    ];

    for (const intern of internsToInsert) {
      await db.query(
        `INSERT INTO interns (id, user_id, mentor_id, college_name, stipend, start_date, end_date)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [intern.id, intern.user_id, intern.mentor_id, intern.college_name, intern.stipend, intern.start_date, intern.end_date]
      );
    }
    console.log(`✅ Seeded ${internsToInsert.length} interns`);
  }

  // 4. Seed Leaves
  const [existingLeaves] = await db.query('SELECT COUNT(*) as count FROM leaves');
  if (existingLeaves[0].count === 0) {
    console.log('Seeding leaves...');
    const leavesToInsert = [
      {
        id: crypto.randomUUID(),
        user_id: empUserId,
        leave_type: 'CASUAL',
        start_date: '2026-09-18',
        end_date: '2026-09-19',
        reason: 'Family function in hometown',
        status: 'PENDING',
        approved_by: null
      },
      {
        id: crypto.randomUUID(),
        user_id: userMap['PROJECT_MANAGER'] || empUserId,
        leave_type: 'SICK',
        start_date: '2026-09-10',
        end_date: '2026-09-11',
        reason: 'Viral fever and doctor consultation',
        status: 'APPROVED',
        approved_by: hrUserId
      },
      {
        id: crypto.randomUUID(),
        user_id: userMap['SALES'] || empUserId,
        leave_type: 'EARNED',
        start_date: '2026-08-20',
        end_date: '2026-08-25',
        reason: 'Annual vacation trip',
        status: 'APPROVED',
        approved_by: hrUserId
      },
      {
        id: crypto.randomUUID(),
        user_id: empUserId,
        leave_type: 'CASUAL',
        start_date: '2026-09-01',
        end_date: '2026-09-02',
        reason: 'Personal work',
        status: 'REJECTED',
        approved_by: hrUserId
      }
    ];

    for (const l of leavesToInsert) {
      await db.query(
        `INSERT INTO leaves (id, user_id, leave_type, start_date, end_date, reason, status, approved_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [l.id, l.user_id, l.leave_type, l.start_date, l.end_date, l.reason, l.status, l.approved_by]
      );
    }
    console.log(`✅ Seeded ${leavesToInsert.length} leaves`);
  }

  // 5. Seed Interviews
  const [existingInterviews] = await db.query('SELECT COUNT(*) as count FROM interviews');
  if (existingInterviews[0].count === 0) {
    console.log('Seeding interviews...');
    // fetch a candidate if any
    const [candidates] = await db.query('SELECT id FROM candidates LIMIT 2');
    const candidateId = candidates[0]?.id || crypto.randomUUID();

    const interviewsToInsert = [
      {
        id: crypto.randomUUID(),
        candidate_id: candidateId,
        round: 'ROUND_1',
        interviewer_id: hrUserId,
        scheduled_at: '2026-09-16 11:00:00',
        duration_minutes: 45,
        meeting_link: 'https://meet.google.com/eth-hr-interview',
        feedback: 'Strong problem solving skills and React knowledge.',
        rating: 4,
        status: 'SCHEDULED'
      },
      {
        id: crypto.randomUUID(),
        candidate_id: candidateId,
        round: 'HR_ROUND',
        interviewer_id: hrUserId,
        scheduled_at: '2026-09-18 15:30:00',
        duration_minutes: 30,
        meeting_link: 'https://meet.google.com/eth-hr-discussion',
        feedback: null,
        rating: null,
        status: 'SCHEDULED'
      },
      {
        id: crypto.randomUUID(),
        candidate_id: candidateId,
        round: 'ROUND_2',
        interviewer_id: hrUserId,
        scheduled_at: '2026-09-12 14:00:00',
        duration_minutes: 60,
        meeting_link: 'https://meet.google.com/eth-tech-eval',
        feedback: 'Completed live coding assignment successfully.',
        rating: 5,
        status: 'COMPLETED'
      }
    ];

    for (const it of interviewsToInsert) {
      await db.query(
        `INSERT INTO interviews (id, candidate_id, round, interviewer_id, scheduled_at, duration_minutes, meeting_link, feedback, rating, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [it.id, it.candidate_id, it.round, it.interviewer_id, it.scheduled_at, it.duration_minutes, it.meeting_link, it.feedback, it.rating, it.status]
      );
    }
    console.log(`✅ Seeded ${interviewsToInsert.length} interviews`);
  }

  // 6. Seed Payroll
  const [existingPayroll] = await db.query('SELECT COUNT(*) as count FROM payroll');
  if (existingPayroll[0].count === 0) {
    console.log('Seeding payroll records...');
    const [emps] = await db.query('SELECT id FROM employees LIMIT 3');
    if (emps.length > 0) {
      const payrollToInsert = [
        {
          id: crypto.randomUUID(),
          employee_id: emps[0].id,
          month_year: '2026-08-01',
          basic: 45000.00,
          hra: 18000.00,
          da: 5000.00,
          gross_salary: 68000.00,
          total_deductions: 5400.00,
          net_salary: 62600.00,
          status: 'PAID'
        },
        {
          id: crypto.randomUUID(),
          employee_id: emps[1]?.id || emps[0].id,
          month_year: '2026-08-01',
          basic: 55000.00,
          hra: 22000.00,
          da: 6000.00,
          gross_salary: 83000.00,
          total_deductions: 6600.00,
          net_salary: 76400.00,
          status: 'PAID'
        }
      ];

      for (const p of payrollToInsert) {
        await db.query(
          `INSERT INTO payroll (id, employee_id, month_year, basic, hra, da, gross_salary, total_deductions, net_salary, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [p.id, p.employee_id, p.month_year, p.basic, p.hra, p.da, p.gross_salary, p.total_deductions, p.net_salary, p.status]
        );
      }
      console.log(`✅ Seeded ${payrollToInsert.length} payroll records`);
    }
  }

  // 7. Seed Job Board Posts
  const [existingJobs] = await db.query('SELECT COUNT(*) as count FROM job_board_posts');
  if (existingJobs[0].count === 0) {
    console.log('Seeding job board posts...');
    const [jobsList] = await db.query('SELECT id FROM jobs LIMIT 2');
    const jobId = jobsList[0]?.id || crypto.randomUUID();

    const jobsToInsert = [
      {
        id: crypto.randomUUID(),
        job_id: jobId,
        platform: 'LINKEDIN',
        external_post_id: 'LI-2026-9021',
        posted_at: new Date(),
        status: 'POSTED',
        created_by: hrUserId
      },
      {
        id: crypto.randomUUID(),
        job_id: jobId,
        platform: 'NAUKRI',
        external_post_id: 'NK-2026-4432',
        posted_at: new Date(),
        status: 'POSTED',
        created_by: hrUserId
      },
      {
        id: crypto.randomUUID(),
        job_id: jobId,
        platform: 'INTERNSHALA',
        external_post_id: 'ISH-2026-7781',
        posted_at: new Date(),
        status: 'POSTED',
        created_by: hrUserId
      }
    ];

    for (const j of jobsToInsert) {
      await db.query(
        `INSERT INTO job_board_posts (id, job_id, platform, external_post_id, posted_at, status, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [j.id, j.job_id, j.platform, j.external_post_id, j.posted_at, j.status, j.created_by]
      );
    }
    console.log(`✅ Seeded ${jobsToInsert.length} job board posts`);
  }

  // 8. Seed Performance Reviews
  const [existingReviews] = await db.query('SELECT COUNT(*) as count FROM performance_reviews');
  if (existingReviews[0].count === 0) {
    console.log('Seeding performance reviews...');
    const [emps] = await db.query('SELECT id FROM employees LIMIT 2');
    if (emps.length > 0) {
      const reviewsToInsert = [
        {
          id: crypto.randomUUID(),
          employee_id: emps[0].id,
          reviewer_id: hrUserId,
          review_date: '2026-08-30',
          rating: 5,
          overall_comment: 'Exceeded quarterly deliverables and demonstrated stellar leadership in team sprints.',
          status: 'SUBMITTED'
        },
        {
          id: crypto.randomUUID(),
          employee_id: emps[1]?.id || emps[0].id,
          reviewer_id: hrUserId,
          review_date: '2026-08-28',
          rating: 4,
          overall_comment: 'Consistent performance in operations and candidate communications.',
          status: 'SUBMITTED'
        }
      ];

      for (const rev of reviewsToInsert) {
        await db.query(
          `INSERT INTO performance_reviews (id, employee_id, reviewer_id, review_date, rating, overall_comment, status)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [rev.id, rev.employee_id, rev.reviewer_id, rev.review_date, rev.rating, rev.overall_comment, rev.status]
        );
      }
      console.log(`✅ Seeded ${reviewsToInsert.length} performance reviews`);
    }
  }

  console.log('--- HR Seed Completed Successfully ---');
  process.exit(0);
}

seedHrData().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
