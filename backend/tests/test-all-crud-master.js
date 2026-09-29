const BASE_URL = 'http://localhost:5000';

async function runMasterCrudAudit() {
  console.log('============================================================');
  console.log('🌐 MASTER CRUD AUDIT: ALL 17 CORE PLATFORM ENTITIES');
  console.log('============================================================\n');

  // Authenticate as Super Admin
  const loginRes = await fetch(`${BASE_URL}/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@ethiroli.com', password: 'Admin@123' })
  });

  if (!loginRes.ok) {
    console.error('❌ Authentication failed:', loginRes.status, await loginRes.text());
    process.exit(1);
  }

  const loginData = await loginRes.json();
  const token = loginData.token || loginData.data?.token;
  const user = loginData.user || loginData.data?.user;
  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  console.log(`✅ Authenticated Session: ${user.email} [${user.role}]\n`);

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
      failed++;
    }
  }

  // 1. Users
  console.log('1. USERS CRUD');
  try {
    const list = await (await fetch(`${BASE_URL}/v1/users`, { headers: authHeaders })).json();
    assert((list.data || list).length > 0, 'GET /v1/users');
    const u = (list.data || list)[0];
    const single = await (await fetch(`${BASE_URL}/v1/users/${u.id}`, { headers: authHeaders })).json();
    assert(single.data?.id === u.id || single.id === u.id, 'GET /v1/users/:id');
  } catch (e) { console.error(e); failed++; }

  // 2. Employees
  console.log('\n2. EMPLOYEES CRUD');
  try {
    const empName = `Audit Emp ${Date.now()}`;
    const create = await (await fetch(`${BASE_URL}/v1/employees`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ name: empName, email: `emp${Date.now()}@test.com`, department: 'QA', designation: 'Tester' })
    })).json();
    const empId = create.data?.id || create.id;
    assert(empId, 'POST /v1/employees');
    const update = await fetch(`${BASE_URL}/v1/employees/${empId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ designation: 'Senior QA' })
    });
    assert(update.ok, 'PUT /v1/employees/:id');
    const del = await fetch(`${BASE_URL}/v1/employees/${empId}`, { method: 'DELETE', headers: authHeaders });
    assert(del.ok, 'DELETE /v1/employees/:id');
  } catch (e) { console.error(e); failed++; }

  // 3. Interns
  console.log('\n3. INTERNS CRUD');
  try {
    const create = await (await fetch(`${BASE_URL}/v1/interns`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ name: `Audit Intern ${Date.now()}`, email: `int${Date.now()}@test.com`, college_name: 'Anna University', stipend: 15000 })
    })).json();
    const intId = create.data?.id || create.id;
    assert(intId, 'POST /v1/interns');
    const update = await fetch(`${BASE_URL}/v1/interns/${intId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ stipend: 16000, progress: 50 })
    });
    assert(update.ok, 'PUT /v1/interns/:id');
    const del = await fetch(`${BASE_URL}/v1/interns/${intId}`, { method: 'DELETE', headers: authHeaders });
    assert(del.ok, 'DELETE /v1/interns/:id');
  } catch (e) { console.error(e); failed++; }

  // 4. Feature Flags
  console.log('\n4. FEATURE FLAGS CRUD');
  try {
    const key = `flag_audit_${Date.now()}`;
    const create = await fetch(`${BASE_URL}/v1/feature-flags`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ flag_key: key, description: 'Audit flag', is_enabled: true })
    });
    assert(create.ok, 'POST /v1/feature-flags');
    const get = await fetch(`${BASE_URL}/v1/feature-flags/${key}`, { headers: authHeaders });
    assert(get.ok, 'GET /v1/feature-flags/:key');
    const update = await fetch(`${BASE_URL}/v1/feature-flags/${key}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ description: 'Updated flag description' })
    });
    assert(update.ok, 'PUT /v1/feature-flags/:key');
    const del = await fetch(`${BASE_URL}/v1/feature-flags/${key}`, { method: 'DELETE', headers: authHeaders });
    assert(del.ok, 'DELETE /v1/feature-flags/:key');
  } catch (e) { console.error(e); failed++; }

  // 5. Leads
  console.log('\n5. LEADS CRUD');
  try {
    const create = await (await fetch(`${BASE_URL}/v1/leads`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ name: `Lead ${Date.now()}`, email: `lead${Date.now()}@test.com`, phone: '9876543210' })
    })).json();
    const leadId = create.data?.id || create.id;
    assert(leadId, 'POST /v1/leads');
    const get = await fetch(`${BASE_URL}/v1/leads/${leadId}`, { headers: authHeaders });
    assert(get.ok, 'GET /v1/leads/:id');
    const update = await fetch(`${BASE_URL}/v1/leads/${leadId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ status: 'QUALIFIED' })
    });
    assert(update.ok, 'PUT /v1/leads/:id');
    const del = await fetch(`${BASE_URL}/v1/leads/${leadId}`, { method: 'DELETE', headers: authHeaders });
    assert(del.ok, 'DELETE /v1/leads/:id');
  } catch (e) { console.error(e); failed++; }

  // 6. Clients
  console.log('\n6. CLIENTS CRUD');
  try {
    const create = await (await fetch(`${BASE_URL}/v1/clients`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ name: `Client Corp ${Date.now()}`, email: `client${Date.now()}@corp.com`, company_name: 'Corp Ltd' })
    })).json();
    const clientId = create.data?.id || create.id;
    assert(clientId, 'POST /v1/clients');
    const update = await fetch(`${BASE_URL}/v1/clients/${clientId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ address: '123 Business St' })
    });
    assert(update.ok, 'PUT /v1/clients/:id');
    const del = await fetch(`${BASE_URL}/v1/clients/${clientId}`, { method: 'DELETE', headers: authHeaders });
    assert(del.ok, 'DELETE /v1/clients/:id');
  } catch (e) { console.error(e); failed++; }

  // 7. Projects
  console.log('\n7. PROJECTS CRUD');
  try {
    const create = await (await fetch(`${BASE_URL}/v1/projects`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ name: `Project ${Date.now()}`, description: 'Test project description' })
    })).json();
    const pId = create.data?.id || create.id;
    assert(pId, 'POST /v1/projects');
    const update = await fetch(`${BASE_URL}/v1/projects/${pId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ name: `Project Updated ${Date.now()}` })
    });
    assert(update.ok, 'PUT /v1/projects/:id');
    const del = await fetch(`${BASE_URL}/v1/projects/${pId}`, { method: 'DELETE', headers: authHeaders });
    assert(del.ok, 'DELETE /v1/projects/:id');
  } catch (e) { console.error(e); failed++; }

  // 8. Tasks
  console.log('\n8. TASKS CRUD');
  try {
    const create = await (await fetch(`${BASE_URL}/v1/tasks`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ title: `Task ${Date.now()}`, description: 'Task description' })
    })).json();
    const tId = create.data?.id || create.id;
    assert(tId, 'POST /v1/tasks');
    const update = await fetch(`${BASE_URL}/v1/tasks/${tId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ title: `Task Updated ${Date.now()}` })
    });
    assert(update.ok, 'PUT /v1/tasks/:id');
    const del = await fetch(`${BASE_URL}/v1/tasks/${tId}`, { method: 'DELETE', headers: authHeaders });
    assert(del.ok, 'DELETE /v1/tasks/:id');
  } catch (e) { console.error(e); failed++; }

  // 9. Jobs
  console.log('\n9. JOBS CRUD');
  try {
    const create = await (await fetch(`${BASE_URL}/v1/jobs`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ title: `Job ${Date.now()}`, description: 'Job description' })
    })).json();
    const jobId = create.data?.id || create.id;
    assert(jobId, 'POST /v1/jobs');
    const update = await fetch(`${BASE_URL}/v1/jobs/${jobId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ title: `Job Updated ${Date.now()}` })
    });
    assert(update.ok, 'PUT /v1/jobs/:id');
    const del = await fetch(`${BASE_URL}/v1/jobs/${jobId}`, { method: 'DELETE', headers: authHeaders });
    assert(del.ok, 'DELETE /v1/jobs/:id');
  } catch (e) { console.error(e); failed++; }

  // 10. Courses
  console.log('\n10. COURSES CRUD');
  try {
    const create = await (await fetch(`${BASE_URL}/v1/courses`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ title: `Course ${Date.now()}`, code: `CRS-${Date.now().toString().slice(-4)}` })
    })).json();
    const crsId = create.data?.id || create.id;
    assert(crsId, 'POST /v1/courses');
    const update = await fetch(`${BASE_URL}/v1/courses/${crsId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ title: `Course Updated ${Date.now()}` })
    });
    assert(update.ok, 'PUT /v1/courses/:id');
    const del = await fetch(`${BASE_URL}/v1/courses/${crsId}`, { method: 'DELETE', headers: authHeaders });
    assert(del.ok, 'DELETE /v1/courses/:id');
  } catch (e) { console.error(e); failed++; }

  // 11. Attendance
  console.log('\n11. ATTENDANCE CRUD');
  try {
    const checkin = await fetch(`${BASE_URL}/v1/attendance/check-in`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ user_id: user.id, date: new Date().toISOString().slice(0, 10), status: 'PRESENT' })
    });
    assert(checkin.ok, 'POST /v1/attendance/check-in');
    const list = await (await fetch(`${BASE_URL}/v1/attendance`, { headers: authHeaders })).json();
    const attId = (list.data || list)[0]?.id;
    assert(attId, 'GET /v1/attendance');
    const update = await fetch(`${BASE_URL}/v1/attendance/${attId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ status: 'PRESENT', check_in_time: '09:15:00' })
    });
    assert(update.ok, 'PUT /v1/attendance/:id');
    const del = await fetch(`${BASE_URL}/v1/attendance/${attId}`, { method: 'DELETE', headers: authHeaders });
    assert(del.ok, 'DELETE /v1/attendance/:id');
  } catch (e) { console.error(e); failed++; }

  // 12. Leaves
  console.log('\n12. LEAVES CRUD');
  try {
    const create = await fetch(`${BASE_URL}/v1/leaves`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ leave_type: 'CASUAL', start_date: '2026-11-01', end_date: '2026-11-02', reason: 'Audit leave' })
    });
    assert(create.ok, 'POST /v1/leaves');
    const list = await (await fetch(`${BASE_URL}/v1/leaves`, { headers: authHeaders })).json();
    const lvId = (list.data || list)[0]?.id;
    assert(lvId, 'GET /v1/leaves');
    const update = await fetch(`${BASE_URL}/v1/leaves/${lvId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ reason: 'Updated reason' })
    });
    assert(update.ok, 'PUT /v1/leaves/:id');
    const del = await fetch(`${BASE_URL}/v1/leaves/${lvId}`, { method: 'DELETE', headers: authHeaders });
    assert(del.ok, 'DELETE /v1/leaves/:id');
  } catch (e) { console.error(e); failed++; }

  // 13. Invoices
  console.log('\n13. INVOICES CRUD');
  try {
    const create = await (await fetch(`${BASE_URL}/v1/invoices`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        invoice_number: `INV-${Date.now()}`,
        issue_date: '2026-09-01',
        due_date: '2026-09-15',
        subtotal: 1000,
        total: 1180
      })
    })).json();
    const invId = create.data?.id || create.id;
    assert(invId, 'POST /v1/invoices');
    const update = await fetch(`${BASE_URL}/v1/invoices/${invId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ total: 1200 })
    });
    assert(update.ok, 'PUT /v1/invoices/:id');
    const del = await fetch(`${BASE_URL}/v1/invoices/${invId}`, { method: 'DELETE', headers: authHeaders });
    assert(del.ok, 'DELETE /v1/invoices/:id');
  } catch (e) { console.error(e); failed++; }

  // 14. Payroll / Salary Structures
  console.log('\n14. PAYROLL & SALARY STRUCTURES CRUD');
  try {
    const emp = (await (await fetch(`${BASE_URL}/v1/employees`, { headers: authHeaders })).json()).data?.[0];
    if (emp) {
      const create = await (await fetch(`${BASE_URL}/v1/payroll/salary-structures`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ employee_id: emp.id, basic: 40000, hra: 12000, effective_from: '2026-01-01' })
      })).json();
      const salId = create.data?.id || create.id;
      assert(salId, 'POST /v1/payroll/salary-structures');
      const update = await fetch(`${BASE_URL}/v1/payroll/salary-structures/${salId}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ basic: 42000 })
      });
      assert(update.ok, 'PUT /v1/payroll/salary-structures/:id');
      const del = await fetch(`${BASE_URL}/v1/payroll/salary-structures/${salId}`, { method: 'DELETE', headers: authHeaders });
      assert(del.ok, 'DELETE /v1/payroll/salary-structures/:id');
    }
  } catch (e) { console.error(e); failed++; }

  // 15. Holidays
  console.log('\n15. HOLIDAYS CRUD');
  try {
    const create = await (await fetch(`${BASE_URL}/v1/holidays`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ name: `Holiday ${Date.now()}`, date: '2026-12-31' })
    })).json();
    const hId = create.data?.id || create.id;
    assert(hId, 'POST /v1/holidays');
    const update = await fetch(`${BASE_URL}/v1/holidays/${hId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ name: `Holiday Updated ${Date.now()}` })
    });
    assert(update.ok, 'PUT /v1/holidays/:id');
    const del = await fetch(`${BASE_URL}/v1/holidays/${hId}`, { method: 'DELETE', headers: authHeaders });
    assert(del.ok, 'DELETE /v1/holidays/:id');
  } catch (e) { console.error(e); failed++; }

  // 16. Badges
  console.log('\n16. BADGES CRUD');
  try {
    const create = await (await fetch(`${BASE_URL}/v1/badges`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ name: `Badge ${Date.now()}`, description: 'Badge description', icon: 'star' })
    })).json();
    const bId = create.data?.id || create.id;
    assert(bId, 'POST /v1/badges');
    const update = await fetch(`${BASE_URL}/v1/badges/${bId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ description: 'Updated badge description' })
    });
    assert(update.ok, 'PUT /v1/badges/:id');
    const del = await fetch(`${BASE_URL}/v1/badges/${bId}`, { method: 'DELETE', headers: authHeaders });
    assert(del.ok, 'DELETE /v1/badges/:id');
  } catch (e) { console.error(e); failed++; }

  // 17. Coupons
  console.log('\n17. COUPONS CRUD');
  try {
    const code = `AUDIT${Date.now().toString().slice(-6)}`;
    const create = await (await fetch(`${BASE_URL}/v1/coupons`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ code, discount_type: 'PERCENTAGE', discount_value: 15, valid_from: '2026-01-01', valid_to: '2026-12-31' })
    })).json();
    const cId = create.data?.id || create.id;
    assert(cId, 'POST /v1/coupons');
    const update = await fetch(`${BASE_URL}/v1/coupons/${cId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ discount_value: 18 })
    });
    assert(update.ok, 'PUT /v1/coupons/:id');
    const del = await fetch(`${BASE_URL}/v1/coupons/${cId}`, { method: 'DELETE', headers: authHeaders });
    assert(del.ok, 'DELETE /v1/coupons/:id');
  } catch (e) { console.error(e); failed++; }

  console.log('\n============================================================');
  console.log(`🎯 MASTER CRUD AUDIT SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('============================================================');

  if (failed > 0) process.exit(1);
  process.exit(0);
}

runMasterCrudAudit();
