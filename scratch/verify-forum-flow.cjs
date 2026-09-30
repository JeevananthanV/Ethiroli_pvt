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
  console.log('Student login:', login.status, !!token);

  // 1. List forum posts (student)
  const list = await request('GET', '/v1/forum/posts', null, token);
  console.log(`[${list.status}] GET /v1/forum/posts - count=${(list.data?.data || []).length}`);
  const firstPost = (list.data?.data || [])[0];

  // 2. Create a forum post WITHOUT course_id (should be allowed now)
  const created = await request('POST', '/v1/forum/posts', {
    title: 'LMS Fix Verification Thread',
    content: 'Created by the student endpoint verification script.'
  }, token);
  console.log(`[${created.status}] POST /v1/forum/posts:`, created.data?.message || (created.data?.error?.message || JSON.stringify(created.data)?.slice(0, 150)));
  const newPostId = created.data?.data?.id;
  console.log('New post id:', newPostId);

  // 3. Get single post (student)
  if (firstPost) {
    const single = await request('GET', `/v1/forum/posts/${firstPost.id}`, null, token);
    console.log(`[${single.status}] GET /v1/forum/posts/:id - title=${single.data?.data?.title?.slice(0, 40)}`);
  }

  // 4. Reply without post_id in body (should be allowed now)
  const reply = await request('POST', `/v1/forum/posts/${newPostId || firstPost?.id}/replies`, {
    content: 'First reply via verification script'
  }, token);
  console.log(`[${reply.status}] POST /v1/forum/posts/:id/replies:`, reply.data?.message || (reply.data?.error?.message || JSON.stringify(reply.data)?.slice(0, 180)));
})();