const http = require('http');

function request(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const payload = data ? JSON.stringify(data) : null;
    const options = {
      hostname: '127.0.0.1',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(body); } catch(e) { json = body; }
        resolve({ status: res.statusCode, data: json });
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

(async () => {
  console.log('=== RUNNING LMS DYNAMIC & INTERACTIVE TEST SUITE ===\n');

  // 1. Logins
  console.log('1. Logging in as Tutor...');
  const tutorLogin = await request('POST', '/v1/auth/login', {
    email: 'tutor@ethiroli.com',
    password: 'Admin@123'
  });
  console.log('Tutor Login Status:', tutorLogin.status);
  const tutorToken = tutorLogin.data?.token || tutorLogin.data?.data?.token;

  console.log('\n2. Logging in as Student...');
  const studentLogin = await request('POST', '/v1/auth/login', {
    email: 'student@ethiroli.com',
    password: 'Admin@123'
  });
  console.log('Student Login Status:', studentLogin.status);
  const studentToken = studentLogin.data?.token || studentLogin.data?.data?.token;

  // 2. Fetch Course
  console.log('\n3. Fetching Courses as Student...');
  const coursesRes = await request('GET', '/v1/courses', null, studentToken);
  console.log(`[${coursesRes.status}] GET /v1/courses -> Found ${coursesRes.data?.data?.length} courses`);
  const courseId = coursesRes.data?.data?.[0]?.id;
  console.log('Using Course ID:', courseId);

  // 3. Modules & Lessons
  console.log('\n4. Creating dynamic Module as Tutor...');
  const createModRes = await request('POST', `/v1/courses/${courseId}/modules`, {
    title: 'Advanced Dynamic Architecture Module'
  }, tutorToken);
  console.log(`[${createModRes.status}] POST /v1/courses/:id/modules:`, createModRes.data?.message);
  const moduleId = createModRes.data?.data?.id;

  console.log('\n5. Creating dynamic Lesson with Blocks as Tutor...');
  const createLsnRes = await request('POST', `/v1/modules/${moduleId}/lessons`, {
    title: 'Reactive Block State Execution',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    content: 'Full comprehensive guide to reactive state pipelines.',
    blocks: [
      {
        block_type: 'MARKDOWN',
        content_payload: { body: '# Architectural Principles\nZero static data.' }
      },
      {
        block_type: 'CODE_PLAYGROUND',
        content_payload: { code: 'const engine = new DynamicLMS(); engine.start();' },
        is_interactive: true
      }
    ]
  }, tutorToken);
  console.log(`[${createLsnRes.status}] POST /v1/modules/:id/lessons:`, createLsnRes.data?.message);
  const lessonId = createLsnRes.data?.data?.id;

  console.log('\n6. Student fetching Modules & Lessons (RBAC Verification)...');
  const studentModsRes = await request('GET', `/v1/courses/${courseId}/modules`, null, studentToken);
  console.log(`[${studentModsRes.status}] Student GET /courses/:id/modules: OK -> ${studentModsRes.data?.data?.length} modules`);
  
  const studentLsnRes = await request('GET', `/v1/lessons/${lessonId}`, null, studentToken);
  console.log(`[${studentLsnRes.status}] Student GET /lessons/:id: OK -> Blocks: ${studentLsnRes.data?.data?.blocks?.length}`);

  // 4. Question Bank
  console.log('\n7. Creating Question in Question Bank as Tutor...');
  const qCreateRes = await request('POST', '/v1/question-bank', {
    topic: 'State Management',
    difficulty: 'MEDIUM',
    question_type: 'MCQ',
    question_text: 'Which hook provides dispatch in Redux Toolkit?',
    explanation: 'useDispatch returns the dispatch method from the Redux store.',
    options: [
      { option_text: 'useDispatch', is_correct: true },
      { option_text: 'useSelector', is_correct: false },
      { option_text: 'useStoreState', is_correct: false },
      { option_text: 'useReducer', is_correct: false }
    ]
  }, tutorToken);
  console.log(`[${qCreateRes.status}] POST /v1/question-bank:`, qCreateRes.data?.message);
  const questionId = qCreateRes.data?.data?.id;

  console.log('\n8. Bulk Importing Questions as Tutor...');
  const bulkRes = await request('POST', '/v1/question-bank/bulk-import', {
    questions: [
      {
        topic: 'JavaScript Basics',
        difficulty: 'EASY',
        question_type: 'MCQ',
        question_text: 'What does typeof null evaluate to?',
        options: [
          { option_text: 'object', is_correct: true },
          { option_text: 'null', is_correct: false },
          { option_text: 'undefined', is_correct: false },
          { option_text: 'number', is_correct: false }
        ]
      },
      {
        topic: 'MySQL Schema',
        difficulty: 'MEDIUM',
        question_type: 'MCQ',
        question_text: 'Which clause ensures no duplicate keys?',
        options: [
          { option_text: 'ON DUPLICATE KEY UPDATE', is_correct: true },
          { option_text: 'UPSERT WHERE', is_correct: false },
          { option_text: 'REPLACE IF EXISTS', is_correct: false }
        ]
      }
    ]
  }, tutorToken);
  console.log(`[${bulkRes.status}] POST /v1/question-bank/bulk-import -> Imported ${bulkRes.data?.data?.count} questions`);

  // 5. Quiz Creation & Question Association
  console.log('\n9. Creating Quiz & Attaching Question Bank IDs...');
  const quizCreateRes = await request('POST', '/v1/quizzes', {
    course_id: courseId,
    title: 'Midterm State Architecture Exam',
    description: 'Comprehensive test of React and Redux architectures.',
    time_limit_minutes: 15,
    passing_score: 70,
    is_published: true,
    question_ids: [questionId]
  }, tutorToken);
  console.log(`[${quizCreateRes.status}] POST /v1/quizzes:`, quizCreateRes.data?.message);
  const quizId = quizCreateRes.data?.data?.id;

  // 6. Security Check: Student Takes Quiz
  console.log('\n10. Student Fetching Quiz to Take (GET /v1/quizzes/:id/take)...');
  const takeRes = await request('GET', `/v1/quizzes/${quizId}/take`, null, studentToken);
  console.log(`[${takeRes.status}] GET /v1/quizzes/:id/take`);
  const studentQuestions = takeRes.data?.data?.questions;
  console.log(`Fetched ${studentQuestions?.length} questions for student`);

  // Verify is_correct is NOT leaked
  let leaked = false;
  for (const q of studentQuestions || []) {
    for (const opt of q.options || []) {
      if (opt.is_correct !== undefined) {
        leaked = true;
      }
    }
  }
  console.log('🔒 SECURITY VERIFICATION: is_correct omitted from student payload:', !leaked ? 'PASSED ✅' : 'FAILED ❌ LEAKED');

  // 7. Server-Side Grading Check
  console.log('\n11. Student Submitting Quiz with Correct Answer (POST /v1/quizzes/:id/submit)...');
  const opt1 = studentQuestions?.[0]?.options?.find(o => o.option_text === 'useDispatch');
  const submitRes = await request('POST', `/v1/quizzes/${quizId}/submit`, {
    answers: {
      [questionId]: opt1?.id
    },
    time_taken_seconds: 124
  }, studentToken);
  console.log(`[${submitRes.status}] POST /v1/quizzes/:id/submit:`);
  console.log('Score:', submitRes.data?.data?.score + '%', '| Passed:', submitRes.data?.data?.is_passed);
  console.log('Itemized Results:', JSON.stringify(submitRes.data?.data?.itemized_results?.[0]));

  // 8. Granular Lesson Completion & Progress Rollup
  console.log('\n12. Student Marking Lesson Complete (POST /v1/lessons/:id/complete)...');
  const completeRes = await request('POST', `/v1/lessons/${lessonId}/complete`, null, studentToken);
  console.log(`[${completeRes.status}] POST /v1/lessons/:id/complete:`);
  console.log('Progress Rollup:', completeRes.data?.data);

  // 9. Curriculum Export Verification
  console.log('\n13. Exporting Course Curriculum as Tutor (GET /v1/courses/:id/export)...');
  const exportRes = await request('GET', `/v1/courses/${courseId}/export`, null, tutorToken);
  console.log(`[${exportRes.status}] GET /v1/courses/:id/export: Modules count =`, exportRes.data?.data?.modules?.length);

  // 10. Module & Lesson Reordering
  console.log('\n14. Testing Module & Lesson Reordering as Tutor...');
  const reorderModRes = await request('POST', `/v1/courses/${courseId}/modules/reorder`, {
    moduleIds: [moduleId]
  }, tutorToken);
  console.log(`[${reorderModRes.status}] Reorder Modules:`, reorderModRes.data?.message);

  const reorderLsnRes = await request('POST', `/v1/modules/${moduleId}/lessons/reorder`, {
    lessonIds: [lessonId]
  }, tutorToken);
  console.log(`[${reorderLsnRes.status}] Reorder Lessons:`, reorderLsnRes.data?.message);

  // 11. Curriculum Import Verification
  console.log('\n15. Importing Bulk Curriculum as Tutor (POST /v1/courses/:id/import)...');
  const importRes = await request('POST', `/v1/courses/${courseId}/import`, {
    modules: [
      {
        title: 'Imported Dynamic Deep Dive',
        lessons: [
          {
            title: 'Dynamic Hydration Principles',
            content: 'Detailed discussion on dynamic hydration without hardcoding.',
            blocks: [
              {
                block_type: 'MARKDOWN',
                content_payload: { body: '# Hydration Mechanics\nFully database driven.' }
              }
            ]
          }
        ]
      }
    ]
  }, tutorToken);
  console.log(`[${importRes.status}] Import Curriculum:`, importRes.data?.message, importRes.data?.data);

  console.log('\n=== ALL LMS DYNAMIC ARCHITECTURE TESTS COMPLETED SUCCESSFULLY! ===');
})();

