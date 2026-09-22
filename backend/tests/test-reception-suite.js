import ReceptionAppointment from '../src/models/ReceptionAppointment.js';
import ReceptionReceipt from '../src/models/ReceptionReceipt.js';
import VisitorLog from '../src/models/VisitorLog.js';
import * as receptionController from '../src/controllers/receptionController.js';
import receptionRoutes from '../src/routes/receptionRoutes.js';
import pool from '../src/config/database.js';

async function runTests() {
  console.log('=== Starting Reception Dashboard Architecture & Model Test Suite ===\n');

  // 1. Verify models
  console.log('1. Verifying Reception models...');
  if (!ReceptionAppointment || !ReceptionReceipt || !VisitorLog) {
    throw new Error('Failed to load Reception models');
  }
  console.log('✅ ReceptionAppointment, ReceptionReceipt, VisitorLog loaded successfully\n');

  // 2. Test ReceptionAppointment formatting
  console.log('2. Testing ReceptionAppointment.format...');
  const sampleAppt = ReceptionAppointment.format({
    id: 'appt-101',
    visitor_name: 'Dr. Anita Joshi',
    phone: '+91 98220 54321',
    purpose: 'Faculty Guest Lecture',
    appointment_date: '2026-09-12',
    appointment_time: '11:00:00',
    status: 'SCHEDULED',
    host_name: null,
    person_to_meet_name: 'Admissions Dean'
  });
  if (sampleAppt.host_name !== 'Admissions Dean' || sampleAppt.status !== 'SCHEDULED') {
    throw new Error('ReceptionAppointment formatting failed');
  }
  console.log('✅ ReceptionAppointment.format correctly mapped host name and status\n');

  // 3. Test ReceptionReceipt formatting
  console.log('3. Testing ReceptionReceipt.format...');
  const sampleReceipt = ReceptionReceipt.format({
    id: 'receipt-101',
    receipt_number: 'REC-20260910-1001',
    student_name: 'Deepika Krishnan',
    amount: '45000.00',
    payment_mode: 'UPI',
    purpose: 'ADMISSION_FEE',
    issuer_name: null,
    issuer_email: 'reception@ethiroli.com'
  });
  if (sampleReceipt.amount !== 45000.00 || sampleReceipt.issuer_name !== 'reception@ethiroli.com') {
    throw new Error('ReceptionReceipt amount casting or issuer mapping failed');
  }
  console.log('✅ ReceptionReceipt numeric amount and receipt details parsed properly\n');

  // 4. Verify receptionController methods
  console.log('4. Verifying receptionController methods...');
  const expectedMethods = [
    'getDashboardSummary',
    'listAppointments',
    'getAppointment',
    'createAppointment',
    'updateAppointmentStatus',
    'deleteAppointment',
    'listReceipts',
    'getReceipt',
    'createReceipt',
    'getReceiptStats',
    'searchDirectory',
    'getReceptionAnalytics'
  ];
  for (const method of expectedMethods) {
    if (typeof receptionController[method] !== 'function') {
      throw new Error(`receptionController is missing method: ${method}`);
    }
  }
  console.log(`✅ All ${expectedMethods.length} receptionController methods verified\n`);

  // 5. Verify receptionRoutes router
  console.log('5. Verifying receptionRoutes router stack...');
  if (!receptionRoutes || !receptionRoutes.stack || receptionRoutes.stack.length === 0) {
    throw new Error('receptionRoutes stack is empty or uninitialized');
  }
  console.log(`✅ receptionRoutes initialized with ${receptionRoutes.stack.length} layers\n`);

  console.log('🎉 ALL RECEPTION DASHBOARD UNIT & ARCHITECTURE TESTS PASSED! 🎉');
  process.exit(0);
}

runTests().catch(err => {
  console.error('❌ Reception Test Suite Failed:', err);
  process.exit(1);
});
