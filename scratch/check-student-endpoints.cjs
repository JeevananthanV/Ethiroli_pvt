const http = require('http');

function request(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const payload = data ? JSON.stringify(data) : null;
    const options = {
      hostname: '127.0.0.1',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    };
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(body); } catch { json = body; }
        resolve({ status: res.statusCode, data: json });
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

(async () => {
  const login = await request('POST', '/v1/auth/login', {
    email: 'student@ethiroli.com',
    password: 'Admin@123'
  });
  const token = login.data?.token || login.data?.data?.token;
  console.log('Student login:', login.status, !!token);

  const checks = [
    ['Dashboard overview', 'GET', '/v1/lms/overview', null],
    ['Courses (enrollments/me)', 'GET', '/v1/enrollments/me', null],
    ['Courses catalog', 'GET', '/v1/courses', null],
    ['Attendance list', 'GET', '/v1/attendance?limit=60', null],
    ['Attendance summary', 'GET', '/v1/attendance/summary', null],
    ['LMS batches', 'GET', '/v1/lms/batches', null],
    ['LMS doubts', 'GET', '/v1/lms/doubts', null],
    ['Quizzes published', 'GET', '/v1/quizzes?is_published=true', null],
    ['Certificates', 'GET', '/v1/certificates', null],
    ['Projects', 'GET', '/v1/projects', null],
    ['Forum threads', 'GET', '/v1/forum/threads', null],
    ['Auth me', 'GET', '/v1/auth/me', null],
  ];

  const results = [];
  for (const [label, method, path] of checks) {
    const res = await request(method, path, null, token);
    const short = res.status;
    results.push({ label, path, status: short });
    console.log(`[${short}] ${method} ${path}  (${label})`);
    if (res.status >= 400) {
      const msg = res.data?.message || res.data?.error?.message || JSON.stringify(res.data)?.slice(0, 180);
      console.log('      ->', msg);
    }
  }

  // capture IDs for nested endpoints
  const enr = await request('GET', '/v1/enrollments/me', null, token);
  const enrollment = enr.data?.data?.[0] || enr.data?.[0];
  const courseId = enrollment?.course_id;
  const courseRes = await request('GET', `/v1/courses/${courseId}/modules`, null, token);
  console.log(`[${courseRes.status}] GET /v1/courses/:id/modules (CoursePlayer modules)`);
  const moduleId = courseRes.data?.data?.[0]?.id;
  const lessonsRes = moduleId ? await request('GET', `/v1/modules/${moduleId}/lessons`, null, token) : null;
  if (moduleId) console.log(`[${lessonsRes.status}] GET /v1/modules/:id/lessons (CoursePlayer lessons)`);

  console.log('\n=== SUMMARY ===');
  const bad = results.filter((r) => r.status >= 400);
  if (bad.length === 0) console.log('ALL student endpoints OK ✅');
  else {
    console.log('FAILING endpoints:');
    for (const b of bad) console.log(`  [${b.status}] ${b.path}`);
  }
})();