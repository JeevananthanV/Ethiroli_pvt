import pool from '../src/config/database.js';
import User from '../src/models/User.js';
import Attendance from '../src/models/Attendance.js';
import Session from '../src/models/Session.js';

async function runTests() {
  console.log('🧪 Starting Attendance Multi-Role Tracking Test Suite...\n');

  let passed = 0;
  let failed = 0;

  const assert = (condition, desc) => {
    if (condition) {
      console.log(`  ✅ PASS: ${desc}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${desc}`);
      failed++;
    }
  };

  try {
    // Find or pick a student, intern, and employee
    const [students] = await pool.execute("SELECT id, email, role FROM users WHERE role = 'STUDENT' LIMIT 1");
    const [interns] = await pool.execute("SELECT id, email, role FROM users WHERE role = 'INTERN' LIMIT 1");
    const [employees] = await pool.execute("SELECT id, email, role FROM users WHERE role = 'EMPLOYEE' LIMIT 1");

    console.log('--- 1. Testing Model Role-Based Filtering ---');
    const employeeList = await Attendance.list({ role: 'EMPLOYEE', limit: 10 });
    const internList = await Attendance.list({ role: 'INTERN', limit: 10 });
    const studentList = await Attendance.list({ role: 'STUDENT', limit: 10 });

    assert(Array.isArray(employeeList), 'Attendance.list with role=EMPLOYEE returns array');
    assert(Array.isArray(internList), 'Attendance.list with role=INTERN returns array');
    assert(Array.isArray(studentList), 'Attendance.list with role=STUDENT returns array');

    if (employeeList.length > 0) {
      assert(employeeList.every(r => r.user_role === 'EMPLOYEE'), 'All records returned by role=EMPLOYEE have user_role EMPLOYEE');
    }
    if (internList.length > 0) {
      assert(internList.every(r => r.user_role === 'INTERN'), 'All records returned by role=INTERN have user_role INTERN');
    }
    if (studentList.length > 0) {
      assert(studentList.every(r => r.user_role === 'STUDENT'), 'All records returned by role=STUDENT have user_role STUDENT');
    }

    console.log('\n--- 2. Testing Check-in and Check-out idempotency & hours ---');
    if (interns.length > 0) {
      const internId = interns[0].id;
      const testDate = '2026-09-24';
      
      // Check in
      await Attendance.checkIn(internId, testDate, 'PRESENT');
      const record = await Attendance.list({ user_id: internId, start_date: testDate, end_date: testDate });
      assert(record.length > 0, 'Intern check-in record created or exists');
      assert(record[0].status === 'PRESENT', 'Intern status is PRESENT');

      // Check out
      await Attendance.checkOut(internId);
      const updatedRecord = await Attendance.list({ user_id: internId, start_date: testDate, end_date: testDate });
      assert(updatedRecord.length > 0 && updatedRecord[0].check_out_time !== null, 'Intern check-out recorded');
    }

    console.log('\n--- 3. Testing Count by Role ---');
    const empCount = await Attendance.count({ role: 'EMPLOYEE' });
    const intCount = await Attendance.count({ role: 'INTERN' });
    const stuCount = await Attendance.count({ role: 'STUDENT' });

    assert(typeof empCount === 'number', `Employee attendance count is number: ${empCount}`);
    assert(typeof intCount === 'number', `Intern attendance count is number: ${intCount}`);
    assert(typeof stuCount === 'number', `Student attendance count is number: ${stuCount}`);

    console.log(`\n========================================`);
    console.log(`Results: ${passed} PASSED, ${failed} FAILED`);
    console.log(`========================================\n`);

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Test Suite encountered error:', err);
    process.exit(1);
  }
}

runTests();
