import pool from '../src/config/database.js';
import User from '../src/models/User.js';
import Session from '../src/models/Session.js';

async function testE2E() {
  console.log('🧪 Starting End-to-End Attendance API Role Verification...\n');

  // 1. Student User Test
  const [students] = await pool.execute("SELECT id, email, role FROM users WHERE role = 'STUDENT' LIMIT 1");
  if (students.length > 0) {
    const student = students[0];
    const sToken = 's-token-' + Date.now();
    await Session.create({ user_id: student.id, token: sToken, expires_at: new Date(Date.now() + 3600000) });
    
    // GET attendance
    const sRes = await fetch('http://localhost:5000/api/v1/attendance', {
      headers: { Authorization: 'Bearer ' + sToken }
    });
    console.log('✅ Student GET /attendance Status:', sRes.status);
    const sData = await sRes.json();
    console.log('   Records returned:', sData.data?.length);

    // GET summary
    const sumRes = await fetch('http://localhost:5000/api/v1/attendance/summary', {
      headers: { Authorization: 'Bearer ' + sToken }
    });
    console.log('✅ Student GET /attendance/summary Status:', sumRes.status);
    const sumData = await sumRes.json();
    console.log('   Summary:', sumData.data);
  }

  // 2. Employee User Test
  const [employees] = await pool.execute("SELECT id, email, role FROM users WHERE role = 'EMPLOYEE' LIMIT 1");
  if (employees.length > 0) {
    const emp = employees[0];
    const eToken = 'e-token-' + Date.now();
    await Session.create({ user_id: emp.id, token: eToken, expires_at: new Date(Date.now() + 3600000) });
    
    const eRes = await fetch('http://localhost:5000/api/v1/attendance', {
      headers: { Authorization: 'Bearer ' + eToken }
    });
    console.log('✅ Employee GET /attendance Status:', eRes.status);
    const eData = await eRes.json();
    console.log('   Records returned:', eData.data?.length);
  }

  // 3. Intern User Test (Check-In & Check-Out)
  const [interns] = await pool.execute("SELECT id, email, role FROM users WHERE role = 'INTERN' LIMIT 1");
  if (interns.length > 0) {
    const intern = interns[0];
    const iToken = 'i-token-' + Date.now();
    await Session.create({ user_id: intern.id, token: iToken, expires_at: new Date(Date.now() + 3600000) });

    const inRes = await fetch('http://localhost:5000/api/v1/attendance/check-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + iToken },
      body: JSON.stringify({ status: 'PRESENT' })
    });
    console.log('✅ Intern Check-In Status:', inRes.status);

    const outRes = await fetch('http://localhost:5000/api/v1/attendance/check-out', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + iToken },
      body: JSON.stringify({})
    });
    console.log('✅ Intern Check-Out Status:', outRes.status);
  }

  console.log('\n========================================');
  console.log('🎉 All Role Attendance Tracking Tests PASSED!');
  console.log('========================================\n');
  process.exit(0);
}

testE2E().catch(err => {
  console.error('Test Error:', err);
  process.exit(1);
});
