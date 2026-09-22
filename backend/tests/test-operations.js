import pool from '../src/config/database.js';
import VisitorLog from '../src/models/VisitorLog.js';
import Timesheet from '../src/models/Timesheet.js';
import * as operationsController from '../src/controllers/operationsController.js';
import operationsRoutes from '../src/routes/operationsRoutes.js';

async function runOperationsTests() {
  console.log('=== Starting Operations Suite Architecture & Model Test Suite ===\n');
  let failures = 0;

  // 1. Verify model imports
  try {
    console.log('1. Verifying model imports...');
    if (VisitorLog && Timesheet) {
      console.log('✅ VisitorLog and Timesheet models loaded successfully');
    } else {
      console.error('❌ Failed to load VisitorLog / Timesheet models');
      failures++;
    }
  } catch (err) {
    console.error('❌ Model import error:', err);
    failures++;
  }

  // 2. Test VisitorLog.format
  try {
    console.log('\n2. Testing VisitorLog.format logic...');
    const formatted = VisitorLog.format({
      id: 'vis-1',
      visitor_name: 'Anand Sharma',
      phone: '+91 9876543210',
      company: 'TechCorp',
      purpose: 'Technical Interview',
      person_to_meet_name: 'CTO',
      badge_number: 'V-999',
      status: 'CHECKED_IN'
    });
    if (formatted && formatted.visitor_name === 'Anand Sharma' && formatted.person_to_meet_full_name === 'CTO') {
      console.log('✅ VisitorLog.format correctly processed visitor entry');
    } else {
      console.error('❌ VisitorLog.format returned invalid structure:', formatted);
      failures++;
    }
  } catch (err) {
    console.error('❌ VisitorLog.format error:', err);
    failures++;
  }

  // 3. Test Timesheet.format
  try {
    console.log('\n3. Testing Timesheet.format logic...');
    const formatted = Timesheet.format({
      id: 'ts-1',
      user_id: 'user-1',
      work_date: '2026-09-10',
      hours_spent: 8.5,
      description: 'LMS Doubt resolution workflow implementation',
      status: 'SUBMITTED',
      proj_name: 'LMS Platform',
      task_desc: 'Build doubts real-time room'
    });
    if (formatted && formatted.project_name === 'LMS Platform' && formatted.hours_spent === 8.5) {
      console.log('✅ Timesheet.format correctly processed timesheet item');
    } else {
      console.error('❌ Timesheet.format returned invalid structure:', formatted);
      failures++;
    }
  } catch (err) {
    console.error('❌ Timesheet.format error:', err);
    failures++;
  }

  // 4. Verify controller exports
  try {
    console.log('\n4. Verifying operationsController endpoints...');
    const expectedControllers = [
      'listVisitors',
      'createVisitor',
      'checkoutVisitor',
      'deleteVisitor',
      'listTimesheets',
      'createTimesheet',
      'approveTimesheet',
      'rejectTimesheet',
      'getSalesOverview',
      'getFinanceOverview',
      'getReceptionOverview'
    ];
    let allExported = true;
    for (const fn of expectedControllers) {
      if (typeof operationsController[fn] !== 'function') {
        console.error(`❌ Controller ${fn} is missing or not a function`);
        allExported = false;
        failures++;
      }
    }
    if (allExported) {
      console.log('✅ All 11 operations controller functions properly exported');
    }
  } catch (err) {
    console.error('❌ Controller verification error:', err);
    failures++;
  }

  // 5. Verify router definition
  try {
    console.log('\n5. Verifying operations router...');
    if (operationsRoutes && typeof operationsRoutes === 'function') {
      console.log('✅ operationsRoutes router instance loaded and ready for mount');
    } else {
      console.error('❌ operationsRoutes is not a valid express router');
      failures++;
    }
  } catch (err) {
    console.error('❌ Router verification error:', err);
    failures++;
  }

  // 6. Test Database Connection
  try {
    console.log('\n6. Checking database pool connection...');
    const [res] = await pool.execute('SELECT 1 as test');
    if (res[0].test === 1) {
      console.log('✅ Database connection operational');
    }
  } catch (err) {
    console.warn('⚠️ Note: Database offline or credentials local:', err.message);
  }

  console.log('\n====================================================');
  if (failures === 0) {
    console.log('ALL OPERATIONS UNIT & ARCHITECTURAL CHECKS PASSED SUCCESSFULLY!');
  } else {
    console.error(`OPERATIONS TEST SUITE FAILED WITH ${failures} ERROR(S)`);
    process.exit(1);
  }

  try {
    await pool.end();
  } catch (e) {}
}

runOperationsTests().catch(err => {
  console.error('Fatal Operations test execution failure:', err);
  process.exit(1);
});
