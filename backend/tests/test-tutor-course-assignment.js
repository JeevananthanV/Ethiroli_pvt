/**
 * Integration test for Tutor Course Assignment & Many-to-Many Enrollment
 */
import mysql from 'mysql2/promise';
import Enrollment from '../src/models/Enrollment.js';

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Admin@123',
  database: process.env.DB_NAME || 'ethiroli',
};

async function run() {
  console.log('--- Testing Tutor-Student Course Assignment in Code ---');
  const conn = await mysql.createConnection(DB_CONFIG);

  try {
    // 1. Get a tutor
    const [tutors] = await conn.query("SELECT id, email, full_name FROM users WHERE role = 'TUTOR' LIMIT 1");
    if (tutors.length === 0) {
      throw new Error('No tutor found in DB');
    }
    const tutor = tutors[0];
    console.log(`✅ Tutor identified: ${tutor.full_name} (${tutor.id})`);

    // 2. Get a student
    const [students] = await conn.query("SELECT id, email, full_name FROM users WHERE role = 'STUDENT' LIMIT 1");
    if (students.length === 0) {
      throw new Error('No student found in DB');
    }
    const student = students[0];
    console.log(`✅ Student identified: ${student.full_name} (${student.id})`);

    // 3. Get at least 2 courses
    const [courses] = await conn.query("SELECT id, code, name FROM courses LIMIT 3");
    if (courses.length < 2) {
      throw new Error('Need at least 2 courses for multi-course assignment test');
    }
    const courseIds = courses.slice(0, 2).map(c => c.id);
    console.log(`✅ Courses for assignment: ${courses.slice(0, 2).map(c => `${c.code} (${c.name})`).join(', ')}`);

    // 4. Test multi-course assignment by tutor
    const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');
    const notes = 'Assigned for Term 1 core curriculum specialization';

    console.log('\n[Action] Assigning 2 courses to student via Enrollment.assignCourses()...');
    const assignedList = await Enrollment.assignCourses({
      student_id: student.id,
      course_ids: courseIds,
      assigned_by_tutor_id: tutor.id,
      due_date: dueDate,
      notes: notes
    });

    console.log(`✅ Successfully assigned ${courseIds.length} courses!`);

    // 5. Test idempotent re-assignment (upsert)
    console.log('\n[Action] Testing idempotent re-assignment with updated notes...');
    const updatedNotes = 'Updated assignment notes: priority completion requested';
    await Enrollment.assignCourses({
      student_id: student.id,
      course_ids: courseIds,
      assigned_by_tutor_id: tutor.id,
      due_date: dueDate,
      notes: updatedNotes
    });
    console.log('✅ Idempotent re-assignment passed with no duplicate constraint errors.');

    // 6. Verify student's customized course list
    console.log('\n[Action] Fetching student customized assigned courses via Enrollment.listByStudentId()...');
    const studentCourses = await Enrollment.listByStudentId(student.id);
    console.log(`✅ Student has ${studentCourses.length} enrolled courses:`);
    studentCourses.forEach((c, idx) => {
      console.log(`   ${idx + 1}. [${c.course_code}] ${c.course_name}`);
      console.log(`      Status: ${c.status} | Progress: ${c.progress_percentage}%`);
      console.log(`      Assigned by Tutor: ${c.assigned_by_tutor_name || 'N/A'} (${c.assigned_by_tutor_email || 'N/A'})`);
      console.log(`      Due Date: ${c.due_date} | Notes: ${c.notes}`);
    });

    // Verify fields match
    const assignedTargetCourse = studentCourses.find(c => c.course_id === courseIds[0]);
    if (!assignedTargetCourse || assignedTargetCourse.assigned_by_tutor_id !== tutor.id) {
      throw new Error('Verification failed: assigned_by_tutor_id does not match tutor');
    }
    if (assignedTargetCourse.notes !== updatedNotes) {
      throw new Error(`Verification failed: notes not updated (got: ${assignedTargetCourse.notes})`);
    }

    // 7. Verify tutor assigned courses list
    console.log('\n[Action] Fetching courses assigned by tutor via Enrollment.listByTutorId()...');
    const tutorAssignments = await Enrollment.listByTutorId(tutor.id);
    console.log(`✅ Tutor has assigned ${tutorAssignments.length} course enrollment(s).`);

    // 8. Test error handling: invalid course ID
    console.log('\n[Action] Testing validation: invalid course ID rejection...');
    let caughtError = null;
    try {
      await Enrollment.assignCourses({
        student_id: student.id,
        course_ids: ['00000000-0000-0000-0000-000000000000'],
        assigned_by_tutor_id: tutor.id
      });
    } catch (err) {
      caughtError = err;
    }
    if (!caughtError) {
      throw new Error('Expected invalid course ID to throw an error, but it succeeded');
    }
    console.log(`✅ Correctly rejected invalid course ID: "${caughtError.message}"`);

    console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY! Many-to-many tutor course assignment is fully functional.');
  } finally {
    await conn.end();
    process.exit(0);
  }
}

run().catch((err) => {
  console.error('\n❌ Test failed:', err);
  process.exit(1);
});
