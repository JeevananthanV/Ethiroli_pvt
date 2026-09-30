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
  console.log('=== REPRO: student LMS overview 401 ===');
  const login = await request('POST', '/v1/auth/login', {
    email: 'student@ethiroli.com',
    password: 'Admin@123'
  });
  console.log('Login status:', login.status);
  const token = login.data?.token || login.data?.data?.token;
  console.log('Token present:', !!token, token ? token.slice(0, 12) + '...' : '');
  console.log('Login body keys:', login.data?.data ? Object.keys(login.data.data) : Object.keys(login.data || {}));

  const overview = await request('GET', '/v1/lms/overview', null, token);
  console.log('Overview status:', overview.status);
  console.log('Overview body:', JSON.stringify(overview.data, null, 2)?.slice(0, 800));

  const me = await request('GET', '/v1/auth/me', null, token);
  console.log('\nAuth/me status:', me.status, JSON.stringify(me.data, null, 2)?.slice(0, 400));
})();