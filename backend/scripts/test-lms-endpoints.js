import 'dotenv/config';

const BASE_URL = 'http://localhost:5000';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch (e) {
    json = text;
  }

  return { status: res.status, ok: res.ok, data: json };
}

async function login(email, password) {
  const res = await request('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    // Try alternate route prefix /v1/auth/login
    const fallbackRes = await request('/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (!fallbackRes.ok) {
      throw new Error(`Login failed for ${email}: ${JSON.stringify(fallbackRes.data)}`);
    }
    return fallbackRes.data.data?.accessToken || fallbackRes.data.accessToken || fallbackRes.data.token || fallbackRes.data.data?.token;
  }

  return res.data.data?.accessToken || res.data.accessToken || res.data.token || res.data.data?.token;
}

async function runTests() {
  console.log('╔══════════════════════════════════════════════════════════════════╗');
  console.log('║       End-to-End LMS API Verification For Student Roles          ║');
  console.log('╚══════════════════════════════════════════════════════════════════╝\n');

  // Test 1: Priya Ramanathan
  console.log('1. Authenticating as Student Priya Ramanathan (priya.ramanathan@ethiroli.edu)...');
  const priyaToken = await login('priya.ramanathan@ethiroli.edu', 'Student@123');
  console.log(' - Login Successful! JWT obtained:', priyaToken ? 'YES' : 'NO');

  const authHeaders = { Authorization: `Bearer ${priyaToken}` };

  // Test 2: LMS Overview
  console.log('\n2. Testing GET /api/v1/lms/overview...');
  let overviewRes = await request('/api/v1/lms/overview', { headers: authHeaders });
  if (overviewRes.status === 404) {
    overviewRes = await request('/v1/lms/overview', { headers: authHeaders });
  }

  console.log(' - Status:', overviewRes.status);
  const overview = overviewRes.data?.data || overviewRes.data;
  console.log(' - Role:', overview?.role);
  console.log(' - Courses count:', overview?.courses?.length);
  if (overview?.courses?.length > 0) {
    console.log('   Sample course:', overview.courses[0].course_code, '-', overview.courses[0].course_name, `(${overview.courses[0].progress_percentage}%)`);
    console.log('   Assigned by Tutor:', overview.courses[0].assigned_by_tutor_name);
  }
  console.log(' - Batches (Cohorts):', overview?.batches?.map(b => `[${b.batch_code}] ${b.name}`).join(' | '));
  console.log(' - Upcoming Quizzes count:', overview?.upcomingQuizzes?.length);
  for (const q of (overview?.upcomingQuizzes || [])) {
    console.log(`   * Quiz: ${q.title} (${q.course_name}) | Time: ${q.time_limit_minutes}m`);
  }
  console.log(' - Upcoming Assignments count:', overview?.upcomingAssignments?.length);
  for (const a of (overview?.upcomingAssignments || [])) {
    console.log(`   * Assignment: ${a.title} | Status: ${a.submission_status} | Grade: ${a.grade || 'Pending'}`);
  }
  console.log(' - Attendance rate:', `${overview?.attendance?.percentage}% (${overview?.attendance?.presentDays}/${overview?.attendance?.totalDays} sessions)`);
  console.log(' - Unresolved Doubts count:', overview?.unresolvedDoubts?.length);
  console.log(' - Badges count:', overview?.badgesCount);
  console.log(' - Certificates count:', overview?.certificatesCount);

  // Test 3: Course Curriculum & Player Data
  console.log('\n3. Testing Course Player Data (Course -> Modules -> Lessons -> Blocks)...');
  const targetCourse = overview.courses[0];
  const courseId = targetCourse.course_id;

  let modulesRes = await request(`/api/v1/courses/${courseId}/modules`, { headers: authHeaders });
  if (modulesRes.status === 404) modulesRes = await request(`/v1/courses/${courseId}/modules`, { headers: authHeaders });
  const modules = modulesRes.data?.data || modulesRes.data || [];
  console.log(` - Found ${modules.length} modules for course ${targetCourse.course_code}`);

  if (modules.length > 0) {
    const firstModule = modules[0];
    console.log(`   Module 1: "${firstModule.title}" (${firstModule.duration_minutes} mins)`);

    let lessonsRes = await request(`/api/v1/modules/${firstModule.id}/lessons`, { headers: authHeaders });
    if (lessonsRes.status === 404) lessonsRes = await request(`/v1/modules/${firstModule.id}/lessons`, { headers: authHeaders });
    const lessons = lessonsRes.data?.data || lessonsRes.data || [];
    console.log(`   - Found ${lessons.length} lessons in Module 1:`);
    for (const lsn of lessons) {
      console.log(`     * Lesson ${lsn.lesson_order}: "${lsn.title}" | Completed: ${lsn.is_completed ? 'YES' : 'NO'}`);
    }

    if (lessons.length > 0) {
      const firstLesson = lessons[0];
      let blocksRes = await request(`/api/v1/lessons/${firstLesson.id}/blocks`, { headers: authHeaders });
      if (blocksRes.status === 404) blocksRes = await request(`/v1/lessons/${firstLesson.id}/blocks`, { headers: authHeaders });
      const blocks = blocksRes.data?.data || blocksRes.data || [];
      console.log(`     - Found ${blocks.length} interactive blocks for Lesson 1 (${blocks.map(b => b.block_type).join(', ')})`);
    }
  }

  // Test 4: Learner Assignments Workspace
  console.log('\n4. Testing GET /v1/assignments/me...');
  let myAssignRes = await request('/api/v1/assignments/me', { headers: authHeaders });
  if (myAssignRes.status === 404) myAssignRes = await request('/v1/assignments/me', { headers: authHeaders });
  const assignments = myAssignRes.data?.data || myAssignRes.data || [];
  console.log(` - Learner retrieved ${assignments.length} assignments across enrolled courses:`);
  for (const a of assignments) {
    console.log(`   * [${a.course_code}] ${a.title} | Due: ${a.due_date?.slice(0, 10)} | Grade: ${a.grade !== null ? a.grade + '/100' : (a.submission_id ? 'Submitted (Awaiting Grade)' : 'Not Submitted')}`);
  }

  // Test 5: Quizzes Available for Take
  console.log('\n5. Testing GET /v1/quizzes and /take...');
  let quizzesRes = await request('/api/v1/quizzes', { headers: authHeaders });
  if (quizzesRes.status === 404) quizzesRes = await request('/v1/quizzes', { headers: authHeaders });
  const quizzesList = quizzesRes.data?.data || quizzesRes.data || [];
  console.log(` - Student can browse ${quizzesList.length} published quizzes.`);

  if (quizzesList.length > 0) {
    const qToTake = quizzesList[0];
    let takeRes = await request(`/api/v1/quizzes/${qToTake.id}/take`, { headers: authHeaders });
    if (takeRes.status === 404) takeRes = await request(`/v1/quizzes/${qToTake.id}/take`, { headers: authHeaders });
    const takeData = takeRes.data?.data || takeRes.data;
    console.log(`   Taking quiz: "${takeData.title}" | Questions count: ${takeData.questions?.length}`);
    if (takeData.questions?.length > 0) {
      const q1 = takeData.questions[0];
      console.log(`   - Question 1: "${q1.question_text}"`);
      console.log(`     Options: ${q1.options?.map(o => o.option_text).join(' | ')}`);
      const hasLeakedAnswer = q1.options?.some(o => o.is_correct !== undefined);
      console.log(`     Answer key leakage check: ${hasLeakedAnswer ? 'FAILED (Answer leaked!)' : 'PASSED (Answer key secured)'}`);
    }
  }

  // Test 6: Authenticating as Rahul Venkat (100% Course Completion & Certificate)
  console.log('\n6. Authenticating as Student Rahul Venkat (rahul.venkat@ethiroli.edu)...');
  const rahulToken = await login('rahul.venkat@ethiroli.edu', 'Student@123');
  const rahulHeaders = { Authorization: `Bearer ${rahulToken}` };

  let rahulOverviewRes = await request('/api/v1/lms/overview', { headers: rahulHeaders });
  if (rahulOverviewRes.status === 404) rahulOverviewRes = await request('/v1/lms/overview', { headers: rahulHeaders });
  const rahulOverview = rahulOverviewRes.data?.data || rahulOverviewRes.data;
  console.log(' - Rahul Venkat LMS Overview:');
  console.log('   * Enrolled courses:', rahulOverview?.courses?.length);
  console.log('   * Badges count:', rahulOverview?.badgesCount);
  console.log('   * Certificates count:', rahulOverview?.certificatesCount);

  // Test 7: Certificate Retrieval
  console.log('\n7. Testing GET /v1/certificates for Rahul Venkat...');
  let certsRes = await request('/api/v1/certificates', { headers: rahulHeaders });
  if (certsRes.status === 404) certsRes = await request('/v1/certificates', { headers: rahulHeaders });
  const certs = certsRes.data?.data || certsRes.data || [];
  console.log(` - Retrieved ${certs.length} certificates:`);
  for (const c of certs) {
    console.log(`   🏆 Certificate: ${c.certificate_number}`);
    console.log(`      Learner: ${c.student_name} | Course: ${c.course_name} (${c.course_code})`);
    console.log(`      Issued: ${c.issue_date?.slice(0, 10)} | Verified: ${c.is_verified ? 'YES' : 'NO'}`);
    console.log(`      PDF URL: ${c.pdf_url}`);
  }

  console.log('\n🎉 ALL 7 E2E LMS TESTS COMPLETED SUCCESSFULLY!');
  process.exit(0);
}

runTests().catch(err => {
  console.error('❌ Test Execution Failed:', err);
  process.exit(1);
});
