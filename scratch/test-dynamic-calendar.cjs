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
  console.log('=== RUNNING DYNAMIC CALENDAR TEST SUITE ===\n');

  // 1. Logins
  console.log('1. Authenticating Roles...');
  const tutorLogin = await request('POST', '/v1/auth/login', { email: 'tutor@ethiroli.com', password: 'Admin@123' });
  const tutorToken = tutorLogin.data?.token || tutorLogin.data?.data?.token;
  console.log(`- Tutor Login: [${tutorLogin.status}] OK`);

  const studentLogin = await request('POST', '/v1/auth/login', { email: 'student@ethiroli.com', password: 'Admin@123' });
  const studentToken = studentLogin.data?.token || studentLogin.data?.data?.token;
  console.log(`- Student Login: [${studentLogin.status}] OK`);

  const adminLogin = await request('POST', '/v1/auth/login', { email: 'admin@ethiroli.com', password: 'Admin@123' });
  const adminToken = adminLogin.data?.token || adminLogin.data?.data?.token;
  console.log(`- Admin Login: [${adminLogin.status}] OK`);

  // 2. Event Types
  console.log('\n2. Fetching Dynamic Event Types...');
  const typesRes = await request('GET', '/v1/calendar/types', null, tutorToken);
  console.log(`[${typesRes.status}] GET /v1/calendar/types: Found ${typesRes.data?.data?.length} types`);
  console.log('Sample Types:', typesRes.data?.data?.slice(0, 4).map(t => `${t.id} (${t.label})`));

  // 3. Role Calendar Config
  console.log('\n3. Fetching Role Calendar Config...');
  const tutorConfigRes = await request('GET', '/v1/calendar/config', null, tutorToken);
  console.log(`[${tutorConfigRes.status}] Tutor Calendar Title:`, tutorConfigRes.data?.data?.calendar_title, '| Default View:', tutorConfigRes.data?.data?.default_view);

  // 4. Creating Role-Permitted Event with Recurrence (Tutor creates Weekly Class)
  console.log('\n4. Tutor Creating Event with Recurrence (Class)...');
  const now = new Date();
  const startTime = new Date(now.getTime() + 3600000).toISOString().slice(0, 19).replace('T', ' ');
  const endTime = new Date(now.getTime() + 7200000).toISOString().slice(0, 19).replace('T', ' ');

  const createEventRes = await request('POST', '/v1/calendar/events', {
    title: 'Advanced Full-Stack Architecture Lecture',
    description: 'Weekly interactive deep-dive into full-stack reactive components.',
    event_type_id: 'evt_class',
    start_time: startTime,
    end_time: endTime,
    recurrence_rule: {
      frequency: 'WEEKLY',
      interval: 1,
      max_occurrences: 4
    }
  }, tutorToken);

  console.log(`[${createEventRes.status}] Create Event:`, createEventRes.data?.message, '| Event ID:', createEventRes.data?.data?.id);
  const parentEventId = createEventRes.data?.data?.id;

  // 5. Expand Recurring Events
  console.log('\n5. Fetching Expanded Calendar Range (Base + Recurring Instances)...');
  const expandUrl = `/v1/calendar/expand?start=${encodeURIComponent(startTime)}&end=${encodeURIComponent(new Date(now.getTime() + 30 * 86400000).toISOString().slice(0, 19).replace('T', ' '))}`;
  const expandRes = await request('GET', expandUrl, null, tutorToken);
  console.log(`[${expandRes.status}] GET /v1/calendar/expand: Retrieved ${expandRes.data?.data?.length} events in range`);

  // 6. Skip Instance Test
  console.log('\n6. Testing Instance Skip on Recurring Event...');
  const skipDate = new Date(now.getTime() + 7 * 86400000).toISOString().split('T')[0];
  const skipRes = await request('POST', `/v1/calendar/instances/${parentEventId}/skip`, {
    date: skipDate
  }, tutorToken);
  console.log(`[${skipRes.status}] Skip Instance on ${skipDate}:`, skipRes.data?.message);

  // 7. RBAC Permission Enforce Test (Student attempting to create a Holiday event)
  console.log('\n7. Security Verification: Student Creating Holiday Event (Should be Forbidden)...');
  const forbiddenRes = await request('POST', '/v1/calendar/events', {
    title: 'Unauthorized Student Holiday',
    event_type_id: 'evt_holiday',
    start_time: startTime,
    end_time: endTime
  }, studentToken);
  console.log(`[${forbiddenRes.status}] Forbidden Check:`, forbiddenRes.status === 403 ? 'PASSED ✅ (403 Forbidden)' : `FAILED ❌ (status: ${forbiddenRes.status})`);

  // 8. Interview Auto-Creation Test
  console.log('\n8. Cross-System Auto-Creation: Scheduling Interview...');
  const interviewRes = await request('POST', '/v1/interviews', {
    candidate_name: 'John Doe',
    vacancy: 'Full Stack Engineer',
    round: 'ROUND_1',
    interview_date: new Date(now.getTime() + 2 * 86400000).toISOString().slice(0, 19).replace('T', ' '),
    interviewer_name: 'Engineering Lead'
  }, adminToken);
  console.log(`[${interviewRes.status}] Interview Scheduled:`, interviewRes.data?.message);

  // Check if calendar event was auto-created for this interview
  const calEventsAfter = await request('GET', '/v1/calendar/events?event_type_id=evt_interview', null, adminToken);
  const foundInterviewEvent = calEventsAfter.data?.data?.find(e => e.title?.includes('John Doe'));
  console.log('Cross-System Calendar Linkage:', foundInterviewEvent ? 'PASSED ✅ Auto-created on Calendar' : 'FAILED ❌');

  console.log('\n=== DYNAMIC CALENDAR BACKEND VERIFICATION COMPLETE! ===');
})();
