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

  for (const p of ['/v1/forum/threads', '/v1/forum/posts', '/v1/projects', '/v1/student-projects/projects']) {
    const r = await request('GET', p, null, token);
    console.log(`[${r.status}] GET ${p}`);
    const body = typeof r.data === 'object' ? JSON.stringify(r.data) : String(r.data);
    console.log('   ', body.slice(0, 220));
  }
})();