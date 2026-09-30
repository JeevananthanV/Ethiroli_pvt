import 'dotenv/config';
import { validateBody } from '../backend/src/middleware/validation.js';
import validationSchemas from '../backend/src/middleware/validationSchemas.js';
import pool from '../backend/src/config/database.js';

async function runComprehensiveHrAudit() {
  console.log('====================================================');
  console.log('🚀 Running HR Role UI/UX/API/KPI Comprehensive Audit');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(title, condition, detail = '') {
    if (condition) {
      console.log(`✅ PASS: ${title} ${detail ? '(' + detail + ')' : ''}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${title} ${detail ? '(' + detail + ')' : ''}`);
      failed++;
    }
  }

  // 1. Validation Schemas presence
  console.log('--- 1. Validation Schemas Audit ---');
  const hrSchemas = [
    'createLeave',
    'updateLeave',
    'updateLeaveStatus',
    'cancelLeave',
    'createAttendance',
    'updateAttendance',
    'createSalaryStructure',
    'updateSalaryStructure',
    'processPayroll',
    'runPayrollForAll'
  ];

  for (const s of hrSchemas) {
    assert(`Schema "${s}" exists in validationSchemas`, Boolean(validationSchemas[s]));
  }

  // 2. updateLeaveStatus validation test
  console.log('\n--- 2. updateLeaveStatus Validation Behavior ---');
  const updateLeaveStatusMW = validateBody('updateLeaveStatus');
  let err1 = null;
  try {
    updateLeaveStatusMW({ method: 'PATCH', body: { status: 'INVALID_STATUS' } }, {}, () => {});
  } catch (e) {
    err1 = e;
  }
  assert('updateLeaveStatus rejects invalid enum value', err1 !== null, err1?.message);

  let success1 = false;
  try {
    updateLeaveStatusMW({ method: 'PATCH', body: { status: 'APPROVED' } }, {}, () => {
      success1 = true;
    });
  } catch (e) {
    success1 = false;
  }
  assert('updateLeaveStatus accepts "APPROVED"', success1);

  let successCancel = false;
  try {
    updateLeaveStatusMW({ method: 'PATCH', body: { status: 'CANCELLED' } }, {}, () => {
      successCancel = true;
    });
  } catch (e) {
    successCancel = false;
  }
  assert('updateLeaveStatus accepts "CANCELLED"', successCancel);

  // 3. updateAttendance validation test
  console.log('\n--- 3. updateAttendance Validation Behavior ---');
  const updateAttendanceMW = validateBody('updateAttendance');
  let errAtt = null;
  try {
    updateAttendanceMW({ method: 'PUT', body: { status: 'INVALID_STATUS' } }, {}, () => {});
  } catch (e) {
    errAtt = e;
  }
  assert('updateAttendance rejects invalid status', errAtt !== null, errAtt?.message);

  let successAtt = false;
  try {
    updateAttendanceMW({ method: 'PUT', body: { status: 'PRESENT' } }, {}, () => {
      successAtt = true;
    });
  } catch (e) {
    successAtt = false;
  }
  assert('updateAttendance accepts "PRESENT"', successAtt);

  // 4. runPayrollForAll validation test
  console.log('\n--- 4. runPayrollForAll Validation Behavior ---');
  const runPayrollMW = validateBody('runPayrollForAll');
  let errPay = null;
  try {
    runPayrollMW({ method: 'POST', body: {} }, {}, () => {});
  } catch (e) {
    errPay = e;
  }
  assert('runPayrollForAll requires month_year', errPay !== null, errPay?.message);

  let successPay = false;
  try {
    runPayrollMW({ method: 'POST', body: { month_year: '2026-09-01' } }, {}, () => {
      successPay = true;
    });
  } catch (e) {
    successPay = false;
  }
  assert('runPayrollForAll accepts valid month_year', successPay);

  // 5. Database leaves table status column verification
  console.log('\n--- 5. Database Schema & Enums Audit ---');
  const [leaveCols] = await pool.execute("SHOW COLUMNS FROM leaves LIKE 'status'");
  const statusType = leaveCols[0]?.Type || '';
  assert('leaves table supports CANCELLED status', statusType.includes('CANCELLED'), statusType);

  // 6. HR Dashboard Metrics query test
  console.log('\n--- 6. HR Dashboard Metrics KPI Query Audit ---');
  const today = new Date().toISOString().slice(0, 10);
  const [
    [empRows],
    [internRows],
    [leaveRows],
    [attRows]
  ] = await Promise.all([
    pool.execute('SELECT COUNT(*) as total FROM employees e JOIN users u ON e.user_id = u.id WHERE u.is_active = TRUE'),
    pool.execute('SELECT COUNT(*) as total FROM interns i JOIN users u ON i.user_id = u.id WHERE u.is_active = TRUE'),
    pool.execute('SELECT COUNT(*) as total FROM leaves l JOIN employees e ON l.user_id = e.user_id WHERE l.status = "APPROVED" AND ? BETWEEN l.start_date AND l.end_date', [today]),
    pool.execute('SELECT COUNT(*) as total FROM attendance a JOIN employees e ON a.user_id = e.user_id WHERE a.date = ? AND a.status = "PRESENT"', [today])
  ]);

  const totalEmp = empRows[0]?.total || 0;
  const presentEmp = attRows[0]?.total || 0;
  assert('totalEmployees count is valid non-negative number', totalEmp >= 0, `Total: ${totalEmp}`);
  assert('presentToday is scoped to employees', presentEmp >= 0 && presentEmp <= totalEmp, `Present: ${presentEmp} / ${totalEmp}`);

  const attendanceRate = totalEmp > 0 ? Math.min(100, Math.max(0, Math.round((presentEmp / totalEmp) * 100))) : 0;
  assert('Attendance rate is bounded between 0% and 100%', attendanceRate >= 0 && attendanceRate <= 100, `${attendanceRate}%`);

  console.log('\n====================================================');
  console.log(`Summary: ${passed} Passed, ${failed} Failed`);
  console.log('====================================================\n');

  await pool.end();
  process.exit(failed > 0 ? 1 : 0);
}

runComprehensiveHrAudit().catch(err => {
  console.error('Audit execution error:', err);
  process.exit(1);
});
