import http from 'http';
import app from './src/app.js';
import { attachSocket } from './src/socket/index.js';
import pool from './src/config/database.js';

const TEST_PORT = 5005;

async function runHealthCheck() {
  console.log('🚀 Starting Backend for Automated Health Check...');

  const server = http.createServer(app);
  const io = attachSocket(server);

  await new Promise((resolve) => {
    server.listen(TEST_PORT, '127.0.0.1', () => {
      console.log(`✅ Test server listening on http://127.0.0.1:${TEST_PORT}`);
      resolve();
    });
  });

  const results = [];

  const endpoints = [
    { name: 'Basic Health', path: '/health', expectedStatus: 200 },
    { name: 'Liveness Probe', path: '/health/live', expectedStatus: 200 },
    { name: 'Readiness Probe (DB)', path: '/health/ready', expectedStatus: 200 },
    { name: 'API Health', path: '/api/health', expectedStatus: 200 },
    { name: 'Frontend Root (SPA)', path: '/', expectedStatus: 200 },
    { name: 'Admin Portal (SPA)', path: '/admin', expectedStatus: 200 },
    { name: 'Socket.IO Polling Handshake', path: '/socket.io/?EIO=4&transport=polling', expectedStatus: 200 }
  ];

  for (const ep of endpoints) {
    try {
      const url = `http://127.0.0.1:${TEST_PORT}${ep.path}`;
      const start = Date.now();
      const res = await fetch(url);
      const latency = Date.now() - start;
      const text = await res.text();
      let body;
      try {
        body = JSON.parse(text);
      } catch {
        body = text.slice(0, 120) + (text.length > 120 ? '...' : '');
      }

      const passed = res.status === ep.expectedStatus;
      results.push({
        test: ep.name,
        path: ep.path,
        status: res.status,
        latency: `${latency}ms`,
        passed,
        body
      });

      console.log(`${passed ? '✅' : '❌'} [${res.status}] ${ep.name} (${latency}ms)`);
      if (typeof body === 'object') {
        console.log('   Response:', JSON.stringify(body));
      } else {
        console.log('   Preview:', body.replace(/\r?\n|\r/g, ' '));
      }
    } catch (err) {
      results.push({
        test: ep.name,
        path: ep.path,
        error: err.message,
        passed: false
      });
      console.error(`❌ [FAILED] ${ep.name}:`, err.message);
    }
  }

  console.log('\n🧹 Cleaning up test server and database connections...');
  await new Promise((resolve) => server.close(resolve));
  await pool.end();
  console.log('✅ Cleanup complete. All tests finished.\n');

  const allPassed = results.every(r => r.passed);
  console.log(`📊 FINAL RESULT: ${allPassed ? 'ALL HEALTH CHECKS PASSED ✅' : 'SOME CHECKS FAILED ❌'}`);
}

runHealthCheck().catch(err => {
  console.error('Fatal error during health check:', err);
  process.exit(1);
});
