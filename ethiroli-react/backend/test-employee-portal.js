import pool from './src/config/database.js';
import SupportTicket from './src/models/SupportTicket.js';
import ProjectMember from './src/models/ProjectMember.js';
import Message from './src/models/Message.js';
import Employee from './src/models/Employee.js';
import Attendance from './src/models/Attendance.js';
import Leave from './src/models/Leave.js';

async function runTests() {
  console.log('--- Starting Employee Portal Integration Test Suite ---');
  let failures = 0;

  // 1. Verify models load
  try {
    console.log('✓ Models loaded successfully: SupportTicket, ProjectMember, Message, Employee, Attendance, Leave');
  } catch (err) {
    console.error('✗ Failed to load models:', err);
    failures++;
  }

  // 2. Test Message format / query structure
  try {
    const formatted = Message.format({
      id: 'test-id',
      sender_id: 'user-1',
      recipient_id: 'user-2',
      message_content: 'Test message content'
    });
    if (formatted && formatted.message_content === 'Test message content') {
      console.log('✓ Message model format logic verified');
    } else {
      console.error('✗ Message format unexpected:', formatted);
      failures++;
    }
  } catch (err) {
    console.error('✗ Message format error:', err);
    failures++;
  }

  // 3. Test SupportTicket format logic
  try {
    const formatted = SupportTicket.format({
      id: 'ticket-1',
      ticket_number: 'TICK-123456',
      subject: 'VPN Access Issue'
    });
    if (formatted && formatted.subject === 'VPN Access Issue') {
      console.log('✓ SupportTicket model format logic verified');
    } else {
      console.error('✗ SupportTicket format unexpected:', formatted);
      failures++;
    }
  } catch (err) {
    console.error('✗ SupportTicket format error:', err);
    failures++;
  }

  // 4. Test ProjectMember format logic
  try {
    const formatted = ProjectMember.format({
      id: 'pm-1',
      project_id: 'proj-1',
      user_id: 'user-1',
      project_role: 'LEAD'
    });
    if (formatted && formatted.project_role === 'LEAD') {
      console.log('✓ ProjectMember model format logic verified');
    } else {
      console.error('✗ ProjectMember format unexpected:', formatted);
      failures++;
    }
  } catch (err) {
    console.error('✗ ProjectMember format error:', err);
    failures++;
  }

  console.log('----------------------------------------------------');
  if (failures === 0) {
    console.log('ALL EMPLOYEE PORTAL UNIT & MODEL TESTS PASSED SUCCESSFULLY!');
  } else {
    console.error(`${failures} TEST(S) FAILED!`);
    process.exit(1);
  }

  await pool.end();
}

runTests().catch(err => {
  console.error('Fatal test execution error:', err);
  process.exit(1);
});
