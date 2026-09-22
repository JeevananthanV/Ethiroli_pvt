import 'dotenv/config';
import Course from '../src/models/Course.js';
import Module from '../src/models/Module.js';
import Lesson from '../src/models/Lesson.js';
import Attendance from '../src/models/Attendance.js';
import Leave from '../src/models/Leave.js';
import pool from '../src/config/database.js';

async function runTests() {
  console.log('--- Phase 2 Self-Verification Test Suite ---');

  // 1. Test Course Model
  console.log('\n1. Testing Course creation...');
  try {
    const testCode = `TEST-${Date.now()}`;
    const courseId = await Course.create({
      code: testCode,
      name: 'Introduction to Testing',
      description: 'Standard software testing procedures',
      duration_days: 10,
      fee: 2500.00,
      tutor_id: '368f5c88-12cd-11ed-861d-0242ac120002' // Seed admin ID
    });
    console.log(`✅ Course.create successful. Course ID: ${courseId}`);

    // Clean up course
    await Course.delete(courseId);
    console.log('✅ Course deleted successfully.');
  } catch (error) {
    console.error('❌ Course model test failed:', error.message);
  }

  // 2. Test Attendance
  console.log('\n2. Testing Attendance logging...');
  try {
    const userId = '368f5c88-12cd-11ed-861d-0242ac120002'; // Seed admin ID
    await Attendance.checkIn(userId);
    console.log('✅ Attendance.checkIn successful.');
    
    await Attendance.checkOut(userId);
    console.log('✅ Attendance.checkOut successful.');
  } catch (error) {
    console.error('❌ Attendance model test failed:', error.message);
  }

  console.log('\n--- Phase 2 Test Suite Complete ---');
  process.exit(0);
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
