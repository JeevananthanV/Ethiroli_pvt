const BASE_URL = 'http://localhost:5000';

async function run() {
  console.log('🚀 TESTING ALL REMAINING CRUD ENTITIES: Attendance, Leaves, Invoices, Payroll, Holidays, Badges, Coupons');

  // Authenticate as Super Admin / Admin
  const loginRes = await fetch(`${BASE_URL}/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@ethiroli.com', password: 'Admin@123' })
  });

  if (!loginRes.ok) {
    console.error('❌ Login failed:', loginRes.status, await loginRes.text());
    process.exit(1);
  }

  const loginData = await loginRes.json();
  const token = loginData.token || loginData.data?.token;
  const user = loginData.user || loginData.data?.user;
  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  console.log(`✅ Authenticated as ${user.email} (${user.role})`);

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // --- 1. ATTENDANCE CRUD ---
  console.log('\n--- 1. ATTENDANCE CRUD ---');
  try {
    const today = new Date().toISOString().slice(0, 10);
    // Check-in
    const checkinRes = await fetch(`${BASE_URL}/v1/attendance/check-in`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ user_id: user.id, date: today, status: 'PRESENT' })
    });
    assert(checkinRes.ok, `POST /v1/attendance/check-in status ${checkinRes.status}`);

    // List
    const listAttRes = await fetch(`${BASE_URL}/v1/attendance`, { headers: authHeaders });
    const listAtt = await listAttRes.json();
    assert(listAttRes.ok && (listAtt.data || listAtt).length > 0, `GET /v1/attendance returns records`);
    const attRecord = (listAtt.data || listAtt)[0];

    // GET by id
    const getAttRes = await fetch(`${BASE_URL}/v1/attendance/${attRecord.id}`, { headers: authHeaders });
    assert(getAttRes.ok, `GET /v1/attendance/:id status ${getAttRes.status}`);

    // PUT update
    const putAttRes = await fetch(`${BASE_URL}/v1/attendance/${attRecord.id}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ status: 'PRESENT', check_in_time: '09:00:00' })
    });
    assert(putAttRes.ok, `PUT /v1/attendance/:id status ${putAttRes.status}`);

    // PATCH update
    const patchAttRes = await fetch(`${BASE_URL}/v1/attendance/${attRecord.id}`, {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify({ status: 'HALF_DAY' })
    });
    assert(patchAttRes.ok, `PATCH /v1/attendance/:id status ${patchAttRes.status}`);

    // Summary
    const sumAttRes = await fetch(`${BASE_URL}/v1/attendance/summary`, { headers: authHeaders });
    assert(sumAttRes.ok, `GET /v1/attendance/summary status ${sumAttRes.status}`);

    // DELETE
    const delAttRes = await fetch(`${BASE_URL}/v1/attendance/${attRecord.id}`, {
      method: 'DELETE',
      headers: authHeaders
    });
    assert(delAttRes.ok, `DELETE /v1/attendance/:id status ${delAttRes.status}`);
  } catch (err) {
    console.error('Attendance error:', err);
    failed++;
  }

  // --- 2. LEAVES CRUD ---
  console.log('\n--- 2. LEAVES CRUD ---');
  try {
    // Create / Apply
    const createLeaveRes = await fetch(`${BASE_URL}/v1/leaves`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        leave_type: 'CASUAL',
        start_date: '2026-10-01',
        end_date: '2026-10-02',
        reason: 'Personal work'
      })
    });
    assert(createLeaveRes.ok, `POST /v1/leaves status ${createLeaveRes.status}`);

    // List
    const listLeaveRes = await fetch(`${BASE_URL}/v1/leaves`, { headers: authHeaders });
    const listLeave = await listLeaveRes.json();
    assert(listLeaveRes.ok && (listLeave.data || listLeave).length > 0, `GET /v1/leaves returns records`);
    const leaveRecord = (listLeave.data || listLeave)[0];

    // GET by id
    const getLeaveRes = await fetch(`${BASE_URL}/v1/leaves/${leaveRecord.id}`, { headers: authHeaders });
    assert(getLeaveRes.ok, `GET /v1/leaves/:id status ${getLeaveRes.status}`);

    // PUT update
    const putLeaveRes = await fetch(`${BASE_URL}/v1/leaves/${leaveRecord.id}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ reason: 'Updated reason via PUT' })
    });
    assert(putLeaveRes.ok, `PUT /v1/leaves/:id status ${putLeaveRes.status}`);

    // PATCH update
    const patchLeaveRes = await fetch(`${BASE_URL}/v1/leaves/${leaveRecord.id}`, {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify({ reason: 'Updated reason via PATCH' })
    });
    assert(patchLeaveRes.ok, `PATCH /v1/leaves/:id status ${patchLeaveRes.status}`);

    // Status update
    const statusLeaveRes = await fetch(`${BASE_URL}/v1/leaves/${leaveRecord.id}/status`, {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify({ status: 'APPROVED' })
    });
    assert(statusLeaveRes.ok, `PATCH /v1/leaves/:id/status status ${statusLeaveRes.status}`);

    // DELETE
    const delLeaveRes = await fetch(`${BASE_URL}/v1/leaves/${leaveRecord.id}`, {
      method: 'DELETE',
      headers: authHeaders
    });
    assert(delLeaveRes.ok, `DELETE /v1/leaves/:id status ${delLeaveRes.status}`);
  } catch (err) {
    console.error('Leave error:', err);
    failed++;
  }

  // --- 3. INVOICES CRUD ---
  console.log('\n--- 3. INVOICES CRUD ---');
  try {
    const invNumber = `INV-TEST-${Date.now()}`;
    // Create
    const createInvRes = await fetch(`${BASE_URL}/v1/invoices`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        invoice_number: invNumber,
        issue_date: '2026-09-01',
        due_date: '2026-09-15',
        subtotal: 5000,
        gst_rate: 18,
        gst_amount: 900,
        total: 5900
      })
    });
    const createInvData = await createInvRes.json();
    assert(createInvRes.ok, `POST /v1/invoices status ${createInvRes.status}`);
    const invId = createInvData.data?.id || createInvData.id;

    // GET by id
    const getInvRes = await fetch(`${BASE_URL}/v1/invoices/${invId}`, { headers: authHeaders });
    assert(getInvRes.ok, `GET /v1/invoices/:id status ${getInvRes.status}`);

    // PUT update
    const putInvRes = await fetch(`${BASE_URL}/v1/invoices/${invId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ total: 6000 })
    });
    assert(putInvRes.ok, `PUT /v1/invoices/:id status ${putInvRes.status}`);

    // Mark paid
    const markPaidRes = await fetch(`${BASE_URL}/v1/invoices/${invId}/mark-paid`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({})
    });
    assert(markPaidRes.ok, `POST /v1/invoices/:id/mark-paid status ${markPaidRes.status}`);

    // DELETE
    const delInvRes = await fetch(`${BASE_URL}/v1/invoices/${invId}`, {
      method: 'DELETE',
      headers: authHeaders
    });
    assert(delInvRes.ok, `DELETE /v1/invoices/:id status ${delInvRes.status}`);
  } catch (err) {
    console.error('Invoice error:', err);
    failed++;
  }

  // --- 4. PAYROLL & SALARY STRUCTURE CRUD ---
  console.log('\n--- 4. PAYROLL & SALARY STRUCTURE CRUD ---');
  try {
    // List employees to attach structure to
    const empRes = await fetch(`${BASE_URL}/v1/employees`, { headers: authHeaders });
    const empData = await empRes.json();
    const employees = empData.data || empData;
    const employeeId = employees.length > 0 ? employees[0].id : null;

    if (employeeId) {
      // Create salary structure
      const createSalRes = await fetch(`${BASE_URL}/v1/payroll/salary-structures`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          employee_id: employeeId,
          basic: 45000,
          hra: 15000,
          da: 5000,
          effective_from: '2026-01-01'
        })
      });
      const createSalData = await createSalRes.json();
      assert(createSalRes.ok, `POST /v1/payroll/salary-structures status ${createSalRes.status}`);
      const salId = createSalData.data?.id || createSalData.id;

      // GET by id
      const getSalRes = await fetch(`${BASE_URL}/v1/payroll/salary-structures/${salId}`, { headers: authHeaders });
      assert(getSalRes.ok, `GET /v1/payroll/salary-structures/:id status ${getSalRes.status}`);

      // PUT update
      const putSalRes = await fetch(`${BASE_URL}/v1/payroll/salary-structures/${salId}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ basic: 50000 })
      });
      assert(putSalRes.ok, `PUT /v1/payroll/salary-structures/:id status ${putSalRes.status}`);

      // DELETE
      const delSalRes = await fetch(`${BASE_URL}/v1/payroll/salary-structures/${salId}`, {
        method: 'DELETE',
        headers: authHeaders
      });
      assert(delSalRes.ok, `DELETE /v1/payroll/salary-structures/:id status ${delSalRes.status}`);
    } else {
      console.log('Skipping salary structure create (no employees found)');
    }
  } catch (err) {
    console.error('Payroll error:', err);
    failed++;
  }

  // --- 5. HOLIDAYS CRUD ---
  console.log('\n--- 5. HOLIDAYS CRUD ---');
  try {
    // Test both /holidays and /calendar/holidays
    const holidayDate = '2026-12-25';
    // POST /holidays
    const createHolRes = await fetch(`${BASE_URL}/v1/holidays`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        name: `Christmas Holiday ${Date.now()}`,
        date: holidayDate,
        description: 'Public holiday celebration'
      })
    });
    const createHolData = await createHolRes.json();
    assert(createHolRes.ok, `POST /v1/holidays status ${createHolRes.status}`);
    const holId = createHolData.data?.id || createHolData.id;

    // GET /calendar/holidays/:id
    const getHolRes = await fetch(`${BASE_URL}/v1/calendar/holidays/${holId}`, { headers: authHeaders });
    assert(getHolRes.ok, `GET /v1/calendar/holidays/:id status ${getHolRes.status}`);

    // PUT /holidays/:id
    const putHolRes = await fetch(`${BASE_URL}/v1/holidays/${holId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ name: 'Christmas Day Updated' })
    });
    assert(putHolRes.ok, `PUT /v1/holidays/:id status ${putHolRes.status}`);

    // DELETE /holidays/:id
    const delHolRes = await fetch(`${BASE_URL}/v1/holidays/${holId}`, {
      method: 'DELETE',
      headers: authHeaders
    });
    assert(delHolRes.ok, `DELETE /v1/holidays/:id status ${delHolRes.status}`);
  } catch (err) {
    console.error('Holiday error:', err);
    failed++;
  }

  // --- 6. BADGES CRUD ---
  console.log('\n--- 6. BADGES CRUD ---');
  try {
    // Create Badge
    const createBadgeRes = await fetch(`${BASE_URL}/v1/badges`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        name: `Master Architect ${Date.now()}`,
        description: 'Demonstrated excellence in system architecture',
        icon: 'trophy',
        criteria: { points: 100 }
      })
    });
    const createBadgeData = await createBadgeRes.json();
    assert(createBadgeRes.ok, `POST /v1/badges status ${createBadgeRes.status}`);
    const badgeId = createBadgeData.data?.id || createBadgeData.id;

    // GET Badge
    const getBadgeRes = await fetch(`${BASE_URL}/v1/badges/${badgeId}`, { headers: authHeaders });
    assert(getBadgeRes.ok, `GET /v1/badges/:id status ${getBadgeRes.status}`);

    // PUT update
    const putBadgeRes = await fetch(`${BASE_URL}/v1/badges/${badgeId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ description: 'Updated criteria description' })
    });
    assert(putBadgeRes.ok, `PUT /v1/badges/:id status ${putBadgeRes.status}`);

    // Award Badge (convenience alias /badges/award with camelCase)
    const awardRes = await fetch(`${BASE_URL}/v1/badges/award`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ userId: user.id, badgeId: badgeId })
    });
    assert(awardRes.ok, `POST /v1/badges/award status ${awardRes.status}`);

    // GET user badges (/badges/user/:userId)
    const userBadgesRes = await fetch(`${BASE_URL}/v1/badges/user/${user.id}`, { headers: authHeaders });
    assert(userBadgesRes.ok, `GET /v1/badges/user/:userId status ${userBadgesRes.status}`);

    // DELETE Badge
    const delBadgeRes = await fetch(`${BASE_URL}/v1/badges/${badgeId}`, {
      method: 'DELETE',
      headers: authHeaders
    });
    assert(delBadgeRes.ok, `DELETE /v1/badges/:id status ${delBadgeRes.status}`);
  } catch (err) {
    console.error('Badge error:', err);
    failed++;
  }

  // --- 7. COUPONS CRUD ---
  console.log('\n--- 7. COUPONS CRUD ---');
  try {
    const couponCode = `TEST${Date.now().toString().slice(-6)}`;
    // Create Coupon
    const createCpnRes = await fetch(`${BASE_URL}/v1/coupons`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        code: couponCode,
        discount_type: 'PERCENTAGE',
        discount_value: 20,
        valid_from: '2026-01-01',
        valid_to: '2026-12-31'
      })
    });
    const createCpnData = await createCpnRes.json();
    assert(createCpnRes.ok, `POST /v1/coupons status ${createCpnRes.status}`);
    const cpnId = createCpnData.data?.id || createCpnData.id;

    // GET by id
    const getCpnRes = await fetch(`${BASE_URL}/v1/coupons/${cpnId}`, { headers: authHeaders });
    assert(getCpnRes.ok, `GET /v1/coupons/:id status ${getCpnRes.status}`);

    // PUT update
    const putCpnRes = await fetch(`${BASE_URL}/v1/coupons/${cpnId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ discount_value: 25 })
    });
    assert(putCpnRes.ok, `PUT /v1/coupons/:id status ${putCpnRes.status}`);

    // Validate Coupon
    const valCpnRes = await fetch(`${BASE_URL}/v1/coupons/validate`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ code: couponCode })
    });
    assert(valCpnRes.ok, `POST /v1/coupons/validate status ${valCpnRes.status}`);

    // DELETE
    const delCpnRes = await fetch(`${BASE_URL}/v1/coupons/${cpnId}`, {
      method: 'DELETE',
      headers: authHeaders
    });
    assert(delCpnRes.ok, `DELETE /v1/coupons/:id status ${delCpnRes.status}`);
  } catch (err) {
    console.error('Coupon error:', err);
    failed++;
  }

  console.log('\n======================================');
  console.log(`TOTAL RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

run();
