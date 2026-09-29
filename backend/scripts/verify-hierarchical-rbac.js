import pool from '../src/config/database.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import User from '../src/models/User.js';
import CredentialService from '../src/services/credentialService.js';

const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('===============================================================');
  console.log('🚀 RUNNING HIERARCHICAL RBAC & CREDENTIAL MANAGEMENT TEST SUITE');
  console.log('===============================================================\n');

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

  try {
    // -------------------------------------------------------------
    // Test 1: Verify Roles & Security Ranks in DB
    // -------------------------------------------------------------
    console.log('📌 Test 1: Database Roles & Privilege Ranks Verification');
    const [roles] = await pool.query('SELECT code, security_rank FROM roles');
    const roleRankMap = Object.fromEntries(roles.map(r => [r.code, r.security_rank]));

    assert(roleRankMap['SUPER_ADMIN'] === 100, 'SUPER_ADMIN rank is 100');
    assert(roleRankMap['HR_SUPERADMIN'] === 90, 'HR_SUPERADMIN rank is 90');
    assert(roleRankMap['ADMIN'] === 80, 'ADMIN rank is 80');
    assert(roleRankMap['HR'] === 60, 'HR rank is 60');
    assert(roleRankMap['SENIOR_TUTOR'] === 45, 'SENIOR_TUTOR rank is 45');
    assert(roleRankMap['TUTOR'] === 40, 'TUTOR rank is 40');
    assert(roleRankMap['EMPLOYEE'] === 20, 'EMPLOYEE rank is 20');
    assert(roleRankMap['STUDENT'] === 10, 'STUDENT rank is 10');

    // -------------------------------------------------------------
    // Test 2: Seed / Ensure Test HR and Admin Users
    // -------------------------------------------------------------
    console.log('\n📌 Test 2: Setup Test Personas');
    const hrEmail = 'test.hr.officer@ethiroli.com';
    const adminEmail = 'test.admin.officer@ethiroli.com';
    const initialHrPass = 'HrOfficer@2026';
    const initialAdminPass = 'AdminOfficer@2026';

    // Remove existing test accounts if present
    const existingHr = await User.findByEmail(hrEmail);
    if (existingHr) await User.delete(existingHr.id);
    const existingAdmin = await User.findByEmail(adminEmail);
    if (existingAdmin) await User.delete(existingAdmin.id);
    const existingTutor = await User.findByEmail('instructor.tutor@ethiroli.com');
    if (existingTutor) await User.delete(existingTutor.id);

    const hrId = crypto.randomUUID();
    const adminId = crypto.randomUUID();

    const hrHash = await bcrypt.hash(initialHrPass, 10);
    const adminHash = await bcrypt.hash(initialAdminPass, 10);

    await User.create({
      id: hrId,
      email: hrEmail,
      password_hash: hrHash,
      full_name: 'Test HR Manager',
      phone: '9876543210',
      role: 'HR'
    });

    await User.create({
      id: adminId,
      email: adminEmail,
      password_hash: adminHash,
      full_name: 'Test Platform Admin',
      phone: '9876543211',
      role: 'ADMIN'
    });

    await CredentialService.getCredentials(hrId);
    await CredentialService.getCredentials(adminId);

    assert(true, 'Test HR and Admin accounts initialized');

    // Authenticate HR user
    const hrLoginRes = await fetch(`${BASE_URL}/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: hrEmail, password: initialHrPass, portal: 'hr' })
    });
    const hrLoginData = await hrLoginRes.json();
    assert(hrLoginRes.status === 200 && hrLoginData.success, 'HR successfully authenticated via /v1/auth/login');
    const hrToken = hrLoginData.data.token;

    // -------------------------------------------------------------
    // Test 3: Hierarchy Rule 1 - HR Cannot Assign Role >= Rank 60
    // -------------------------------------------------------------
    console.log('\n📌 Test 3: Anti-Privilege Escalation (Role Assignment Ceiling)');
    
    // Attempt to create ADMIN (rank 80)
    const createAdminRes = await fetch(`${BASE_URL}/v1/users`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${hrToken}`
      },
      body: JSON.stringify({
        email: 'illegal.admin@ethiroli.com',
        full_name: 'Illegal Admin',
        role: 'ADMIN'
      })
    });
    assert(createAdminRes.status === 403, `HR blocked from provisioning ADMIN (Rank 80 >= 60). HTTP ${createAdminRes.status}`);

    // Attempt to create peer HR (rank 60)
    const createPeerHrRes = await fetch(`${BASE_URL}/v1/users`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${hrToken}`
      },
      body: JSON.stringify({
        email: 'illegal.peer.hr@ethiroli.com',
        full_name: 'Illegal Peer HR',
        role: 'HR'
      })
    });
    assert(createPeerHrRes.status === 403, `HR blocked from provisioning peer HR (Rank 60 >= 60). HTTP ${createPeerHrRes.status}`);

    // -------------------------------------------------------------
    // Test 4: HR Allowed to Provision Tutor (Rank 40 < 60)
    // -------------------------------------------------------------
    console.log('\n📌 Test 4: Downward Account Provisioning (HR -> Tutor)');
    const tutorEmail = 'instructor.tutor@ethiroli.com';
    await pool.query("DELETE FROM users WHERE email = ?", [tutorEmail]);

    const tutorInitialPass = 'TutorInitial@2026';
    const createTutorRes = await fetch(`${BASE_URL}/v1/users`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${hrToken}`
      },
      body: JSON.stringify({
        email: tutorEmail,
        full_name: 'Senior Python Tutor',
        phone: '9123456780',
        role: 'TUTOR',
        password: tutorInitialPass
      })
    });
    const createTutorData = await createTutorRes.json();
    assert(createTutorRes.status === 201 && createTutorData.success, `HR successfully provisioned TUTOR (Rank 40 < 60)`);
    const tutorId = createTutorData.data.id;

    // Verify user_credentials was created
    const tutorCreds = await CredentialService.getCredentials(tutorId);
    assert(tutorCreds !== null, 'user_credentials record automatically populated for newly provisioned Tutor');

    // -------------------------------------------------------------
    // Test 5: Hierarchy Rule 2 - HR Cannot Rotate Admin / Peer Credentials
    // -------------------------------------------------------------
    console.log('\n📌 Test 5: Anti-Privilege Escalation (Vertical Credential Rotation Blocked)');
    const rotateAdminRes = await fetch(`${BASE_URL}/v1/users/${adminId}/rotate-credentials`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${hrToken}`
      },
      body: JSON.stringify({ temporaryPassword: 'HackedAdmin@999' })
    });
    assert(rotateAdminRes.status === 403, `HR blocked from rotating ADMIN credentials. HTTP ${rotateAdminRes.status}`);

    // -------------------------------------------------------------
    // Test 6: HR Administrative Credential Rotation for Tutor
    // -------------------------------------------------------------
    console.log('\n📌 Test 6: Downward Credential Rotation (HR -> Tutor)');
    const tempPassword = 'TempTutor@Pass123';
    const rotateTutorRes = await fetch(`${BASE_URL}/v1/users/${tutorId}/rotate-credentials`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${hrToken}`
      },
      body: JSON.stringify({ temporaryPassword: tempPassword })
    });
    const rotateTutorData = await rotateTutorRes.json();
    assert(rotateTutorRes.status === 200 && rotateTutorData.success, `HR successfully rotated Tutor credentials`);
    assert(rotateTutorData.data.requires_password_change === true, 'Tutor credentials flagged requires_password_change = true');

    // -------------------------------------------------------------
    // Test 7: Tutor Login with Temporary Password
    // -------------------------------------------------------------
    console.log('\n📌 Test 7: Tutor Login & Flag Verification');
    const tutorLoginRes = await fetch(`${BASE_URL}/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: tutorEmail, password: tempPassword, portal: 'tutor' })
    });
    const tutorLoginData = await tutorLoginRes.json();
    assert(tutorLoginRes.status === 200 && tutorLoginData.success, 'Tutor authenticated with temporary password');
    assert(tutorLoginData.data.user.requires_password_change === true, 'Tutor received requires_password_change flag upon login');
    const tutorToken = tutorLoginData.data.token;

    // -------------------------------------------------------------
    // Test 8: Tutor Self-Service Profile & Metrics
    // -------------------------------------------------------------
    console.log('\n📌 Test 8: Tutor Self-Service Endpoints');
    const tutorProfileRes = await fetch(`${BASE_URL}/v1/tutor/profile`, {
      headers: { 'Authorization': `Bearer ${tutorToken}` }
    });
    const tutorProfileData = await tutorProfileRes.json();
    assert(tutorProfileRes.status === 200 && tutorProfileData.success, 'Tutor fetched self-service profile');
    assert(tutorProfileData.data.credentials.requires_password_change === true, 'Profile confirms requires_password_change is active');

    // Update phone via self-service
    const updateTutorProfileRes = await fetch(`${BASE_URL}/v1/tutor/profile`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tutorToken}`
      },
      body: JSON.stringify({ phone: '9988776655' })
    });
    assert(updateTutorProfileRes.status === 200, 'Tutor successfully updated self-service profile details');

    // -------------------------------------------------------------
    // Test 9: Password History Enforcement (Prevent Reusing Last 5)
    // -------------------------------------------------------------
    console.log('\n📌 Test 9: Password History Enforcement (5-Rotation Limit)');
    
    // Attempt 1: Try to reuse the temporary password
    const reuseTempRes = await fetch(`${BASE_URL}/v1/tutor/credentials/password`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tutorToken}`
      },
      body: JSON.stringify({
        currentPassword: tempPassword,
        newPassword: tempPassword
      })
    });
    assert(reuseTempRes.status === 400, `Rejected reuse of current temporary password. HTTP ${reuseTempRes.status}`);

    // Attempt 2: Try to reuse original initial password
    const reuseInitialRes = await fetch(`${BASE_URL}/v1/tutor/credentials/password`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tutorToken}`
      },
      body: JSON.stringify({
        currentPassword: tempPassword,
        newPassword: tutorInitialPass
      })
    });
    assert(reuseInitialRes.status === 400, `Rejected reuse of initial password from history. HTTP ${reuseInitialRes.status}`);

    // Attempt 3: Choose a strong, completely fresh password
    const freshPassword = 'FreshTutorPassword@2026!';
    const changePassRes = await fetch(`${BASE_URL}/v1/tutor/credentials/password`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tutorToken}`
      },
      body: JSON.stringify({
        currentPassword: tempPassword,
        newPassword: freshPassword,
        confirmPassword: freshPassword
      })
    });
    const changePassData = await changePassRes.json();
    assert(changePassRes.status === 200 && changePassData.success, 'Tutor set new password successfully');
    assert(changePassData.data.requires_password_change === false, 'requires_password_change cleared to false');

    // -------------------------------------------------------------
    // Test 10: Brute Force Account Lockout (5 Failed Attempts)
    // -------------------------------------------------------------
    console.log('\n📌 Test 10: Brute Force Protection & Account Lockout');
    for (let i = 1; i <= 5; i++) {
      await fetch(`${BASE_URL}/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: tutorEmail, password: 'WrongPassword@123', portal: 'tutor' })
      });
    }

    // 6th attempt should be blocked by account lockout
    const lockoutRes = await fetch(`${BASE_URL}/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: tutorEmail, password: freshPassword, portal: 'tutor' })
    });
    const lockoutData = await lockoutRes.json();
    assert(
      lockoutRes.status === 401 && (lockoutData.message.includes('locked') || lockoutData.message.includes('attempts')),
      `Account locked after 5 failed attempts. HTTP ${lockoutRes.status}: "${lockoutData.message}"`
    );

    // Clean up lockout for subsequent runs
    await CredentialService.resetFailedAttempts(tutorId);

    // Clean up test users
    await User.delete(hrId);
    await User.delete(adminId);
    await User.delete(tutorId);

    console.log('\n===============================================================');
    console.log(`🏁 VERIFICATION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('===============================================================');

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error('❌ Test execution error:', err);
    process.exit(1);
  }
}

runTests();
