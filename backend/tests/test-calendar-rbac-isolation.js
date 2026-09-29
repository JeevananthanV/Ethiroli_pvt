import pool from '../src/config/database.js';
import CalendarEvent from '../src/models/CalendarEvent.js';
import CalendarRoleConfigService from '../src/services/calendarRoleConfigService.js';

async function runRbacTests() {
  console.log('🧪 Starting Calendar RBAC & HR/Student Isolation Test Suite...\n');

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
    const startDate = '2026-09-01 00:00:00';
    const endDate = '2026-09-30 23:59:59';

    // 1. Test HR View
    console.log('--- 1. Testing HR Calendar Query Scoping ---');
    const hrConfig = await CalendarRoleConfigService.getConfigForRole('HR');
    const hrEvents = await CalendarEvent.listExpanded({
      start_date: startDate,
      end_date: endDate,
      userId: 'test_hr_user',
      userRole: 'HR',
      showOthersEvents: hrConfig?.show_others_events ?? true,
      allowedEventTypes: hrConfig?.event_type_visibility
    });

    const hrHasInterviews = hrEvents.some(e => e.event_type === 'INTERVIEW' || e.role === 'HR');
    const hrHasLeaves = hrEvents.some(e => e.event_type === 'LEAVE');
    const hrHasStudentEvents = hrEvents.some(e => e.role === 'STUDENT');

    assert(hrHasInterviews, 'HR user can see HR Interview events');
    assert(hrHasLeaves, 'HR user can see HR Leave events');
    assert(!hrHasStudentEvents, 'HR user does NOT see student-exclusive events');

    // 2. Test Student View
    console.log('\n--- 2. Testing Student Calendar Query Scoping ---');
    const studentConfig = await CalendarRoleConfigService.getConfigForRole('STUDENT');
    const studentEvents = await CalendarEvent.listExpanded({
      start_date: startDate,
      end_date: endDate,
      userId: 'test_student_user',
      userRole: 'STUDENT',
      showOthersEvents: studentConfig?.show_others_events ?? false,
      allowedEventTypes: studentConfig?.event_type_visibility
    });

    const studentHasClasses = studentEvents.some(e => e.event_type === 'CLASS' || e.role === 'STUDENT' || e.role === 'TUTOR');
    const studentHasHrInterviews = studentEvents.some(e => e.event_type === 'INTERVIEW' || e.role === 'HR');
    const studentHasHrLeaves = studentEvents.some(e => e.event_type === 'LEAVE');

    assert(studentHasClasses, 'Student can see Class lectures');
    assert(!studentHasHrInterviews, 'Student CANNOT see HR Interviews (Zero Leakage)');
    assert(!studentHasHrLeaves, 'Student CANNOT see HR Employee Leaves (Zero Leakage)');

    // 3. Test Employee View
    console.log('\n--- 3. Testing Employee Calendar Isolation ---');
    const empConfig = await CalendarRoleConfigService.getConfigForRole('EMPLOYEE');
    const empEvents = await CalendarEvent.listExpanded({
      start_date: startDate,
      end_date: endDate,
      userId: 'test_employee_user',
      userRole: 'EMPLOYEE',
      showOthersEvents: empConfig?.show_others_events ?? true,
      allowedEventTypes: empConfig?.event_type_visibility
    });

    const empHasHrInterviews = empEvents.some(e => e.event_type === 'INTERVIEW' || e.role === 'HR');
    const empHasStudentEvents = empEvents.some(e => e.role === 'STUDENT');

    assert(!empHasHrInterviews, 'Regular Employee CANNOT see confidential HR Interviews');
    assert(!empHasStudentEvents, 'Regular Employee CANNOT see Student private events');

    // 4. Test Super Admin Global View
    console.log('\n--- 4. Testing Super Admin Global Access ---');
    const adminEvents = await CalendarEvent.listExpanded({
      start_date: startDate,
      end_date: endDate,
      userId: 'test_admin_user',
      userRole: 'SUPER_ADMIN',
      showOthersEvents: true,
      allowedEventTypes: null
    });

    const adminHasInterviews = adminEvents.some(e => e.event_type === 'INTERVIEW' || e.role === 'HR');
    const adminHasClasses = adminEvents.some(e => e.event_type === 'CLASS');

    assert(adminHasInterviews, 'Super Admin can view HR Events');
    assert(adminHasClasses, 'Super Admin can view Student/Tutor Classes');

    console.log(`\n========================================`);
    console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
    console.log(`========================================\n`);

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error('Test execution failed:', err);
    process.exit(1);
  }
}

runRbacTests();
