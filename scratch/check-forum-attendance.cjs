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
  const login = await request('POST', '/v1/auth/login', { email: 'student@ethiroli.com', password: 'Admin@123' });
  const token = login.data?.token || login.data?.data?.token;
  console.log('Login:', login.status, !!token);

  const checks = [
    ['Forum threads (frontend forumApi)', 'GET', '/v1/forum/threads', null],
    ['Forum posts (backend)', 'GET', '/v1/forum/posts', null],
    ['Attendance check-in (student)', 'POST', '/v1/attendance/check-in', {}],
  ];

  for (const [label, method, path, body] of checks) {
    const res = await request(method, path, body, token);
    const msg = res.data?.message || res.data?.error?.message || '';
    console.log(`[${res.status}] ${method} ${path}  (${label})${msg ? ' -> ' + msg : ''}`);
  }
})();