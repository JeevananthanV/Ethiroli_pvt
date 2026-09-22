import 'dotenv/config';
import fetch from 'node-fetch';

const BASE_URL = process.env.API_URL || 'http://localhost:3000';

async function testCORS() {
  console.log('\n=== CORS VERIFICATION TEST ===\n');
  console.log(`API Base URL: ${BASE_URL}`);
  console.log(`Frontend Origin: http://localhost:5173\n`);

  try {
    // Test 1: OPTIONS preflight request
    console.log('1. Testing CORS Preflight (OPTIONS request)...');
    const preflightResponse = await fetch(`${BASE_URL}/api/v1/auth/portal-login`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:5173',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type, X-Portal'
      }
    });

    console.log(`   Status: ${preflightResponse.status} ${preflightResponse.statusText}`);
    const corsHeaders = {
      'Access-Control-Allow-Origin': preflightResponse.headers.get('access-control-allow-origin'),
      'Access-Control-Allow-Credentials': preflightResponse.headers.get('access-control-allow-credentials'),
      'Access-Control-Allow-Methods': preflightResponse.headers.get('access-control-allow-methods'),
      'Access-Control-Allow-Headers': preflightResponse.headers.get('access-control-allow-headers'),
      'Access-Control-Max-Age': preflightResponse.headers.get('access-control-max-age')
    };
    
    console.log('\n   CORS Headers Returned:');
    Object.entries(corsHeaders).forEach(([key, value]) => {
      if (value) {
        console.log(`   ✅ ${key}: ${value}`);
      } else {
        console.log(`   ❌ ${key}: MISSING`);
      }
    });

    // Test 2: Blocked origin
    console.log('\n2. Testing Blocked Origin (Should fail)...');
    const blockedResponse = await fetch(`${BASE_URL}/api/v1/auth/portal-login`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://evil-site.com',
        'Access-Control-Request-Method': 'POST'
      }
    });

    const blockedOriginHeader = blockedResponse.headers.get('access-control-allow-origin');
    if (!blockedOriginHeader) {
      console.log('   ✅ Blocked origin correctly rejected (no CORS header)');
    } else {
      console.log(`   ❌ Blocked origin allowed: ${blockedOriginHeader}`);
    }

    // Test 3: Login with correct headers
    console.log('\n3. Testing Login with CORS Headers...');
    const loginResponse = await fetch(`${BASE_URL}/api/v1/auth/portal-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Portal': 'hr',
        'Origin': 'http://localhost:5173'
      },
      body: JSON.stringify({
        email: 'hr@ethiroli.com',
        password: 'HrPassword123!'
      })
    });

    console.log(`   Status: ${loginResponse.status} ${loginResponse.statusText}`);
    console.log(`   CORS Origin: ${loginResponse.headers.get('access-control-allow-origin')}`);
    console.log(`   CORS Credentials: ${loginResponse.headers.get('access-control-allow-credentials')}`);

    const loginData = await loginResponse.json();
    if (loginData.success) {
      console.log(`   ✅ Login successful`);
      console.log(`   ✅ User: ${loginData.data.user.full_name} (${loginData.data.user.role})`);
      console.log(`   ✅ Token: ${loginData.data.token.substring(0, 20)}...`);
    } else {
      console.log(`   ❌ Login failed: ${loginData.message}`);
    }

    // Test 4: Verify allowed origins
    console.log('\n4. Testing Allowed Origins...');
    const origins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5000'
    ];

    for (const origin of origins) {
      const response = await fetch(`${BASE_URL}/api/v1/auth/portal-login`, {
        method: 'OPTIONS',
        headers: {
          'Origin': origin,
          'Access-Control-Request-Method': 'POST'
        }
      });

      const allowedOrigin = response.headers.get('access-control-allow-origin');
      if (allowedOrigin === origin) {
        console.log(`   ✅ ${origin} allowed`);
      } else {
        console.log(`   ❌ ${origin} blocked (got: ${allowedOrigin})`);
      }
    }

    console.log('\n=== CORS VERIFICATION COMPLETE ===\n');

  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testCORS();
