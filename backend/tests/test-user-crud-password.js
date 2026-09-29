import http from 'http';
import crypto from 'crypto';
import pool from '../src/config/database.js';
import User from '../src/models/User.js';
import Session from '../src/models/Session.js';

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}`;

const request = (path, method = 'GET', body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

const createTestSession = async (userId, role, portalSlug = 'app') => {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await Session.create({
    user_id: userId,
    token,
    portal_slug: portalSlug,
    expires_at: expiresAt,
    user_agent: 'test-user-crud-agent',
    ip_address: '127.0.0.1'
  });
  return token;
};

async function runTests() {
  console.log('============================================================');
  console.log('🧪 TESTING USER CRUD & PASSWORD MANAGEMENT ENDPOINTS');
  console.log('============================================================\n');

  try {
    // 1. Identify or retrieve Super Admin and Standard Admin
    const [superAdminRows] = await pool.query("SELECT id, role, email FROM users WHERE role = 'SUPER_ADMIN' AND is_active = TRUE LIMIT 1");
    if (superAdminRows.length === 0) throw new Error('No active SUPER_ADMIN found in DB');
    const superAdmin = superAdminRows[0];

    const [adminRows] = await pool.query("SELECT id, role, email FROM users WHERE role = 'ADMIN' AND is_active = TRUE LIMIT 1");
    if (adminRows.length === 0) throw new Error('No active ADMIN found in DB');
    const admin = adminRows[0];

    console.log(`1. Authenticating test identities:`);
    console.log(`   - Super Admin: ${superAdmin.id} (${superAdmin.role})`);
    console.log(`   - Standard Admin: ${admin.id} (${admin.role})`);

    const superAdminToken = await createTestSession(superAdmin.id, superAdmin.role, 'super-admin');
    const adminToken = await createTestSession(admin.id, admin.role, 'admin');

    // 2. Test GET /v1/users/filters
    console.log('\n2. Testing GET /v1/users/filters:');
    const filterRes = await request('/v1/users/filters', 'GET', null, adminToken);
    if (filterRes.status === 200 && filterRes.data.data?.roles?.includes('EMPLOYEE')) {
      console.log('   Filter metadata retrieved: PASSED ✅ (Roles:', filterRes.data.data.roles.length, ')');
    } else {
      throw new Error(`GET /v1/users/filters failed: ${JSON.stringify(filterRes)}`);
    }

    // 3. Test GET /v1/users (list)
    console.log('\n3. Testing GET /v1/users:');
    const listRes = await request('/v1/users?limit=10', 'GET', null, adminToken);
    if (listRes.status === 200 && Array.isArray(listRes.data.data)) {
      console.log(`   List retrieved: PASSED ✅ (${listRes.data.data.length} users returned)`);
      // Verify password_hash is stripped
      const exposedHash = listRes.data.data.find(u => u.password_hash);
      if (exposedHash) {
        throw new Error('Security flaw: password_hash exposed in user list!');
      }
      console.log('   Security verification: password_hash is cleanly stripped ✅');
    } else {
      throw new Error(`GET /v1/users failed: ${JSON.stringify(listRes)}`);
    }

    // 4. Test POST /v1/users (Create subordinate user as Admin)
    console.log('\n4. Testing POST /v1/users (Admin creates subordinate user):');
    const testSubordinateEmail = `test_crud_emp_${Date.now()}@ethiroli.local`;
    const createSubRes = await request('/v1/users', 'POST', {
      email: testSubordinateEmail,
      full_name: 'Test CRUD Employee',
      role: 'EMPLOYEE',
      phone: '+919988776655'
    }, adminToken);

    if (createSubRes.status === 201 && createSubRes.data.data?.id) {
      console.log(`   Subordinate user created: PASSED ✅ (ID: ${createSubRes.data.data.id})`);
    } else {
      throw new Error(`Admin failed to create subordinate: ${JSON.stringify(createSubRes)}`);
    }
    const subordinateId = createSubRes.data.data.id;

    // 5. Test Horizontal/Vertical Escalation Prevention: Admin tries to create Super Admin or Admin
    console.log('\n5. Testing Privilege Boundary: Admin tries to create Admin/SuperAdmin:');
    const illegalEscalateRes = await request('/v1/users', 'POST', {
      email: `illegal_admin_${Date.now()}@ethiroli.local`,
      full_name: 'Rogue Admin',
      role: 'ADMIN'
    }, adminToken);
    if (illegalEscalateRes.status === 403) {
      console.log('   Privilege Escalation Blocked: PASSED ✅ (HTTP 403)');
    } else {
      throw new Error(`Privilege boundary failed! Expected 403 but got ${illegalEscalateRes.status}`);
    }

    // 6. Test GET /v1/users/:id
    console.log('\n6. Testing GET /v1/users/:id:');
    const getSingleRes = await request(`/v1/users/${subordinateId}`, 'GET', null, adminToken);
    if (getSingleRes.status === 200 && getSingleRes.data.data?.id === subordinateId) {
      if (getSingleRes.data.data.password_hash) {
        throw new Error('Security flaw: password_hash exposed on GET /:id');
      }
      console.log(`   Fetch single user: PASSED ✅ (Name: ${getSingleRes.data.data.full_name})`);
    } else {
      throw new Error(`GET /v1/users/:id failed: ${JSON.stringify(getSingleRes)}`);
    }

    // 7. Test PUT /v1/users/:id (Frontend user update method)
    console.log('\n7. Testing PUT /v1/users/:id:');
    const putRes = await request(`/v1/users/${subordinateId}`, 'PUT', {
      full_name: 'Updated CRUD Employee Name',
      role: 'EMPLOYEE'
    }, adminToken);
    if (putRes.status === 200 && putRes.data.data?.full_name === 'Updated CRUD Employee Name') {
      console.log(`   PUT update user: PASSED ✅`);
    } else {
      throw new Error(`PUT /v1/users/:id failed: ${JSON.stringify(putRes)}`);
    }

    // 8. Test PATCH /v1/users/:id/status
    console.log('\n8. Testing PATCH /v1/users/:id/status:');
    const statusRes = await request(`/v1/users/${subordinateId}/status`, 'PATCH', {
      status: 'inactive'
    }, adminToken);
    if (statusRes.status === 200 && statusRes.data.data?.is_active === false) {
      console.log(`   User deactivation: PASSED ✅`);
    } else {
      throw new Error(`PATCH /v1/users/:id/status failed: ${JSON.stringify(statusRes)}`);
    }

    // 9. Test POST /v1/users/:id/restore
    console.log('\n9. Testing POST /v1/users/:id/restore:');
    const restoreRes = await request(`/v1/users/${subordinateId}/restore`, 'POST', {}, adminToken);
    if (restoreRes.status === 200 && restoreRes.data.data?.is_active === true) {
      console.log(`   User restoration: PASSED ✅`);
    } else {
      throw new Error(`POST /v1/users/:id/restore failed: ${JSON.stringify(restoreRes)}`);
    }

    // 10. Test POST /v1/users/:id/reset-password (Administrative Reset)
    console.log('\n10. Testing Administrative Password Reset:');
    // A) Admin resets subordinate user password
    const adminResetSubRes = await request(`/v1/users/${subordinateId}/reset-password`, 'POST', {
      newPassword: 'NewEmployeePass123!'
    }, adminToken);
    if (adminResetSubRes.status === 200) {
      console.log('   Admin resets subordinate password: PASSED ✅ (HTTP 200)');
    } else {
      throw new Error(`Admin reset subordinate failed: ${JSON.stringify(adminResetSubRes)}`);
    }

    // B) Admin tries to reset Super Admin password (MUST BE 403)
    const adminResetSuperRes = await request(`/v1/users/${superAdmin.id}/reset-password`, 'POST', {
      newPassword: 'HackedSuperAdminPass123!'
    }, adminToken);
    if (adminResetSuperRes.status === 403) {
      console.log('   Privilege Boundary (Admin cannot reset Super Admin): PASSED ✅ (HTTP 403)');
    } else {
      throw new Error(`Security violation! Admin was able to reset Super Admin password! ${JSON.stringify(adminResetSuperRes)}`);
    }

    // 11. Test POST /v1/auth/change-password (Self-service password change)
    console.log('\n11. Testing Self-Service Password Change (POST /v1/auth/change-password):');
    // Create a dedicated session for subordinate user
    const subToken = await createTestSession(subordinateId, 'EMPLOYEE', 'employee');

    // A) Invalid current password -> should fail
    const invalidChangeRes = await request('/v1/auth/change-password', 'POST', {
      currentPassword: 'WrongPassword999!',
      newPassword: 'MyNewSecretPass123!'
    }, subToken);
    if (invalidChangeRes.status === 400 || invalidChangeRes.status === 401) {
      console.log('   Invalid current password rejected: PASSED ✅ (HTTP ' + invalidChangeRes.status + ')');
    } else {
      throw new Error(`Invalid current password should have failed: ${JSON.stringify(invalidChangeRes)}`);
    }

    // B) Valid current password -> should succeed
    const validChangeRes = await request('/v1/auth/change-password', 'POST', {
      currentPassword: 'NewEmployeePass123!',
      newPassword: 'MyNewSecretPass123!'
    }, subToken);
    if (validChangeRes.status === 200) {
      console.log('   Valid password change: PASSED ✅ (HTTP 200)');
    } else {
      throw new Error(`Valid password change failed: ${JSON.stringify(validChangeRes)}`);
    }

    // C) Verify login with new password
    const loginRes = await request('/v1/auth/login', 'POST', {
      email: testSubordinateEmail,
      password: 'MyNewSecretPass123!'
    });
    if (loginRes.status === 200 && loginRes.data.data?.user?.id === subordinateId) {
      console.log('   Login with newly changed password: PASSED ✅');
    } else {
      throw new Error(`Login with new password failed: ${JSON.stringify(loginRes)}`);
    }

    // 12. Test DELETE /v1/users/:id
    console.log('\n12. Testing DELETE /v1/users/:id:');
    // A) Admin tries to delete Super Admin (must fail 403)
    const adminDeleteSuperRes = await request(`/v1/users/${superAdmin.id}`, 'DELETE', null, adminToken);
    if (adminDeleteSuperRes.status === 403) {
      console.log('   Admin cannot delete Super Admin: PASSED ✅ (HTTP 403)');
    } else {
      throw new Error(`Admin delete super admin failed: ${JSON.stringify(adminDeleteSuperRes)}`);
    }

    // B) Admin tries permanent=true (must fail 403)
    const adminHardDeleteRes = await request(`/v1/users/${subordinateId}?permanent=true`, 'DELETE', null, adminToken);
    if (adminHardDeleteRes.status === 403) {
      console.log('   Admin cannot permanent purge: PASSED ✅ (HTTP 403)');
    } else {
      throw new Error(`Admin hard delete should be 403: ${JSON.stringify(adminHardDeleteRes)}`);
    }

    // C) Admin soft-deletes subordinate user (should succeed 200)
    const adminSoftDeleteRes = await request(`/v1/users/${subordinateId}`, 'DELETE', null, adminToken);
    if (adminSoftDeleteRes.status === 200) {
      console.log('   Admin soft-deletes subordinate user: PASSED ✅ (HTTP 200)');
    } else {
      throw new Error(`Admin soft-delete failed: ${JSON.stringify(adminSoftDeleteRes)}`);
    }

    // D) Super Admin permanent purge (should succeed 200)
    const superHardDeleteRes = await request(`/v1/users/${subordinateId}?permanent=true`, 'DELETE', null, superAdminToken);
    if (superHardDeleteRes.status === 200) {
      console.log('   Super Admin permanently purges subordinate user: PASSED ✅ (HTTP 200)');
    } else {
      throw new Error(`Super Admin hard delete failed: ${JSON.stringify(superHardDeleteRes)}`);
    }

    // Verify completely purged from DB
    const [finalCheck] = await pool.query('SELECT id FROM users WHERE id = ?', [subordinateId]);
    if (finalCheck.length === 0) {
      console.log('   Database check: User record permanently deleted from MySQL table ✅');
    } else {
      throw new Error('User was not permanently deleted!');
    }

    console.log('\n============================================================');
    console.log('✨ ALL USER CRUD & PASSWORD MANAGEMENT TESTS PASSED 100%!');
    console.log('============================================================\n');
    process.exit(0);

  } catch (err) {
    console.error('\n❌ TEST RUN FAILED:', err.message);
    if (err.stack) console.error(err.stack);
    process.exit(1);
  }
}

runTests();
