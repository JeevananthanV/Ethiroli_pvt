import 'dotenv/config';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import pool from '../src/config/database.js';
import User from '../src/models/User.js';
import Enrollment from '../src/models/Enrollment.js';

const STUDENTS_DATA = [
  {
    name: 'Priya Ramanathan',
    email: 'priya.ramanathan@ethiroli.edu',
    phone: '+91 98401 23451',
    college: 'Anna University',
    department: 'Computer Science',
    year: '4th Year',
    targetProgress: 88,
    attendanceRate: 0.90
  },
  {
    name: 'Karthik Subramanian',
    email: 'karthik.subramanian@ethiroli.edu',
    phone: '+91 98401 23452',
    college: 'PSG College of Technology',
    department: 'Information Technology',
    year: '3rd Year',
    targetProgress: 65,
    attendanceRate: 0.85
  },
  {
    name: 'Sneha Sundaram',
    email: 'sneha.sundaram@ethiroli.edu',
    phone: '+91 98401 23453',
    college: 'SSN College of Engineering',
    department: 'Electronics & Communication',
    year: '4th Year',
    targetProgress: 95,
    attendanceRate: 0.95
  },
  {
    name: 'Vignesh Balaji',
    email: 'vignesh.balaji@ethiroli.edu',
    phone: '+91 98401 23454',
    college: 'SRM Institute of Science and Technology',
    department: 'Software Engineering',
    year: '3rd Year',
    targetProgress: 72,
    attendanceRate: 0.70 // Below 75% for compliance tracking
  },
  {
    name: 'Ananya Krishnan',
    email: 'ananya.krishnan@ethiroli.edu',
    phone: '+91 98401 23455',
    college: 'Vellore Institute of Technology',
    department: 'Computer Science & AI',
    year: '2nd Year',
    targetProgress: 45,
    attendanceRate: 0.88
  },
  {
    name: 'Rahul Venkat',
    email: 'rahul.venkat@ethiroli.edu',
    phone: '+91 98401 23456',
    college: 'Madras Institute of Technology',
    department: 'Information Technology',
    year: '4th Year',
    targetProgress: 100,
    attendanceRate: 1.00
  },
  {
    name: 'Divya Natarajan',
    email: 'divya.natarajan@ethiroli.edu',
    phone: '+91 98401 23457',
    college: 'SASTRA Deemed University',
    department: 'Computer Science',
    year: '3rd Year',
    targetProgress: 55,
    attendanceRate: 0.80
  },
  {
    name: 'Manoj Kumar',
    email: 'manoj.kumar@ethiroli.edu',
    phone: '+91 98401 23458',
    college: 'Thiagarajar College of Engineering',
    department: 'Electrical & Computer',
    year: '4th Year',
    targetProgress: 35,
    attendanceRate: 0.60 // Below 75% for compliance tracking
  },
  {
    name: 'Keerthana Sridhar',
    email: 'keerthana.sridhar@ethiroli.edu',
    phone: '+91 98401 23459',
    college: 'Kumaraguru College of Technology',
    department: 'Data Science',
    year: '3rd Year',
    targetProgress: 82,
    attendanceRate: 0.90
  },
  {
    name: 'Arun Prasad',
    email: 'arun.prasad@ethiroli.edu',
    phone: '+91 98401 23460',
    college: 'St. Joseph\'s College of Engineering',
    department: 'Computer Science',
    year: '2nd Year',
    targetProgress: 20,
    attendanceRate: 0.78
  }
];

async function seedStudents() {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║       Loading 10 Realistic Student Profiles into DB       ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  try {
    const passwordHash = await bcrypt.hash('Student@123', 10);

    // 1. Identify tutor
    const [tutors] = await pool.execute("SELECT id FROM users WHERE role = 'TUTOR' LIMIT 1");
    const tutorId = tutors[0]?.id || null;
    console.log(`👨‍🏫 Assigned Tutor: ${tutorId || 'None'}`);

    // 2. Ensure foundational courses exist
    const additionalCourses = [
      { code: 'FULLSTACK-101', name: 'Full Stack Web Development (MERN)', duration_days: 60, fee: 15000.00, desc: 'Complete frontend, backend, database and cloud architecture.' },
      { code: 'PYTHON-101', name: 'Python Programming & Data Structures', duration_days: 45, fee: 12000.00, desc: 'Core python, algorithmic thinking, and data processing.' },
      { code: 'CLOUD-101', name: 'Cloud Infrastructure & DevOps Mastery', duration_days: 30, fee: 10000.00, desc: 'Docker, CI/CD pipelines, AWS and production monitoring.' }
    ];

    for (const c of additionalCourses) {
      await pool.execute(
        `INSERT INTO courses (id, code, name, description, duration_days, fee, tutor_id, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, 1)
         ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description), fee = VALUES(fee), tutor_id = COALESCE(VALUES(tutor_id), courses.tutor_id)`,
        [crypto.randomUUID(), c.code, c.name, c.desc, c.duration_days, c.fee, tutorId]
      );
    }

    const [allCourses] = await pool.execute('SELECT id, code, name FROM courses WHERE is_active = 1');
    console.log(`📚 Active Courses available for enrollment: ${allCourses.length}`);

    // 3. Create or update each student user
    const createdStudents = [];

    for (let i = 0; i < STUDENTS_DATA.length; i++) {
      const data = STUDENTS_DATA[i];
      let user = await User.findByEmail(data.email);
      let userId;

      const preferences = {
        college: data.college,
        department: data.department,
        academic_year: data.year,
        notification_email: true,
        notification_sms: true,
        theme: 'system'
      };

      if (!user) {
        userId = await User.create({
          email: data.email,
          password_hash: passwordHash,
          full_name: data.name,
          phone: data.phone,
          role: 'STUDENT',
          preferences
        });
        console.log(`✅ [${i + 1}/10] Created Student: ${data.name} (${data.email}) -> ID: ${userId}`);
      } else {
        userId = user.id;
        await User.update(userId, {
          password_hash: passwordHash,
          role: 'STUDENT',
          full_name: data.name,
          phone: data.phone
        });
        await pool.execute(
          'UPDATE users SET is_active = TRUE, preferences = ? WHERE id = ?',
          [JSON.stringify(preferences), userId]
        );
        console.log(`🔄 [${i + 1}/10] Updated Existing Student: ${data.name} (${data.email}) -> ID: ${userId}`);
      }

      createdStudents.push({ ...data, id: userId });

      // 4. Enroll in 2-3 courses with realistic progress
      const assignedCourse1 = allCourses[i % allCourses.length];
      const assignedCourse2 = allCourses[(i + 1) % allCourses.length];
      const assignedCourseIds = [assignedCourse1.id, assignedCourse2.id];

      const dueDate = new Date(Date.now() + 45 * 86400000).toISOString().slice(0, 10);
      const notes = `Specialized cohort assignment for ${data.department}. Focus on weekly milestones and assessments.`;

      await Enrollment.assignCourses({
        student_id: userId,
        course_ids: assignedCourseIds,
        assigned_by_tutor_id: tutorId,
        due_date: dueDate,
        notes
      });

      // Update progress percentages
      const enrollments = await Enrollment.listByStudentId(userId);
      if (enrollments[0]) {
        const isComplete = data.targetProgress === 100;
        await Enrollment.update(enrollments[0].id, {
          progress_percentage: data.targetProgress,
          status: isComplete ? 'COMPLETED' : 'ACTIVE',
          completed_at: isComplete ? new Date() : null
        });
      }
      if (enrollments[1]) {
        const secondaryProgress = Math.max(0, data.targetProgress - 25);
        await Enrollment.update(enrollments[1].id, {
          progress_percentage: secondaryProgress,
          status: secondaryProgress === 100 ? 'COMPLETED' : 'ACTIVE'
        });
      }

      // 5. Seed Attendance records for past 10 days
      const daysCount = 10;
      for (let dayOffset = 0; dayOffset < daysCount; dayOffset++) {
        const d = new Date(Date.now() - dayOffset * 86400000);
        // Skip Sundays
        if (d.getDay() === 0) continue;

        const dateStr = d.toISOString().slice(0, 10);
        const isPresent = Math.random() < data.attendanceRate;
        const status = isPresent ? 'PRESENT' : 'ABSENT';
        const isLate = isPresent && Math.random() < 0.15;
        const checkInTime = isPresent ? `${dateStr} 09:${isLate ? '25' : '02'}:00` : null;
        const checkOutTime = isPresent ? `${dateStr} 17:05:00` : null;

        await pool.execute(
          `INSERT INTO attendance (id, user_id, date, check_in_time, check_out_time, status, is_late)
           VALUES (?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE 
             status = VALUES(status), 
             check_in_time = VALUES(check_in_time), 
             check_out_time = VALUES(check_out_time), 
             is_late = VALUES(is_late)`,
          [crypto.randomUUID(), userId, dateStr, checkInTime, checkOutTime, status, isLate]
        );
      }
    }

    console.log('\n────────────────────────────────────────────────────────────');
    console.log('🎉 Successfully loaded and enrolled all 10 students!');
    console.log('────────────────────────────────────────────────────────────');
    console.log('Credentials Summary:');
    console.log('Default Password for all seeded students: Student@123\n');
    console.table(
      createdStudents.map(s => ({
        ID: s.id.slice(0, 8) + '...',
        Name: s.name,
        Email: s.email,
        College: s.college,
        Progress: `${s.targetProgress}%`,
        Compliance: s.attendanceRate >= 0.75 ? 'Compliant (>=75%)' : 'At-Risk (<75%)'
      }))
    );

    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('Fatal error seeding students:', err);
    process.exit(1);
  }
}

seedStudents();
