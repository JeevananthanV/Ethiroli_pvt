import 'dotenv/config';
import pool from '../src/config/database.js';
import User from '../src/models/User.js';
import Enrollment from '../src/models/Enrollment.js';
import Attendance from '../src/models/Attendance.js';
import bcrypt from 'bcrypt';

async function verify() {
  console.log('--- Verifying 10 Seeded Students ---');

  const testEmail = 'priya.ramanathan@ethiroli.edu';
  const student = await User.findByEmail(testEmail);
  if (!student) throw new Error('Student not found by email');

  console.log('1. User Lookup & Decryption:');
  console.log(' - Name:', student.full_name);
  console.log(' - Email:', student.email);
  console.log(' - Phone:', student.phone);
  console.log(' - Preferences:', student.preferences);

  const isPasswordValid = await bcrypt.compare('Student@123', student.password_hash);
  console.log(' - Password verification (Student@123):', isPasswordValid ? 'VALID' : 'INVALID');

  console.log('\n2. Course Enrollments:');
  const enrollments = await Enrollment.listByStudentId(student.id);
  console.log(` - Enrolled in ${enrollments.length} courses:`);
  for (const e of enrollments) {
    console.log(`   * [${e.course_code}] ${e.course_title || e.course_name} (Progress: ${e.progress_percentage}%, Status: ${e.status})`);
    console.log(`     Assigned by: ${e.assigned_by_tutor_name || 'Senior Instructor'} | Due: ${e.due_date}`);
  }

  console.log('\n3. Attendance Records:');
  const attRecords = await Attendance.list({ user_id: student.id, limit: 10 });
  console.log(` - Found ${attRecords.length} attendance records for ${student.full_name}`);
  const presentDays = attRecords.filter(a => a.status === 'PRESENT').length;
  console.log(` - Present days: ${presentDays} / ${attRecords.length} (${Math.round((presentDays / attRecords.length) * 100)}%)`);

  const [totalStudentsRow] = await pool.execute("SELECT COUNT(*) as count FROM users WHERE role = 'STUDENT'");
  console.log('\n4. Total Students in Database:', totalStudentsRow[0].count);

  await pool.end();
  process.exit(0);
}

verify().catch(err => {
  console.error(err);
  process.exit(1);
});
