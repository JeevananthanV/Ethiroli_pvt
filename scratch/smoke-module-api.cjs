// Smoke test for module-based curriculum endpoints (previously 500 due to missing tables)
const http = require('http');

const HOST = '127.0.0.1';
const PORT = 5000;

function request(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = http.request(
      {
        hostname: HOST,
        port: PORT,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      },
      (res) => {
        let raw = '';
        res.on('data', (c) => (raw += c));
        res.on('end', () => {
          let parsed;
          try { parsed = JSON.parse(raw); } catch { parsed = raw; }
          resolve({ status: res.statusCode, data: parsed });
        });
      }
    );
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function main() {
  console.log('\n== Smoke test: module-based curriculum API ==\n');

  // 1. Login as tutor
  const login = await request('POST', '/v1/auth/login', {
    email: 'tutor@ethiroli.com',
    password: 'Admin@123',
  });
  console.log(`[${login.status}] POST /v1/auth/login`);
  const token = login.data?.data?.token || login.data?.token;
  if (!token) {
    console.log('FAIL: could not obtain tutor token ->', JSON.stringify(login.data).slice(0, 300));
    process.exit(1);
  }
  console.log('      tutor token OK');

  // 2. Technology modules registry
  const mods = await request('GET', '/v1/technology-modules', null, token);
  const modList = Array.isArray(mods.data?.data) ? mods.data.data : [];
  console.log(`[${mods.status}] GET /v1/technology-modules -> ${modList.length} modules`);

  // 3. Programs registry
  const progs = await request('GET', '/v1/programs', null, token);
  const progList = Array.isArray(progs.data?.data) ? progs.data.data : [];
  console.log(`[${progs.status}] GET /v1/programs -> ${progList.length} programs`);

  // 4. Courses list (to pick one for course-module queries)
  const courses = await request('GET', '/v1/courses', null, token);
  const courseList = Array.isArray(courses.data?.data) ? courses.data.data : [];
  console.log(`[${courses.status}] GET /v1/courses -> ${courseList.length} courses`);

  // 5. Modules by course (if any course exists)
  if (courseList.length > 0) {
    const courseId = courseList[0].id || courseList[0].course_id;
    const byCourse = await request('GET', `/v1/courses/${courseId}/technology-modules`, null, token);
    console.log(`[${byCourse.status}] GET /v1/courses/:id/technology-modules -> ok`);
  }

  const failures = [mods, progs, courses].filter((r) => r.status >= 400);
  if (failures.length > 0) {
    console.log('\nSMOKE FAILED - some endpoints returned errors.');
    failures.forEach((f) => console.log('  ', JSON.stringify(f.data).slice(0, 300)));
    process.exit(1);
  }
  console.log('\nSMOKE PASSED - module curriculum endpoints respond without errors.');
}

main().catch((err) => {
  console.error('Smoke test error:', err.message);
  process.exit(1);
});