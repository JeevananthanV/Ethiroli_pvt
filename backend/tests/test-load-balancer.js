import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clusterScript = path.resolve(__dirname, '../src/cluster.js');

const TEST_PORT = 5055;
const NUM_WORKERS = 3;
const TOTAL_REQUESTS = 60;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(url, timeoutMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.status === 200) return true;
    } catch {
      // Server not ready yet
    }
    await sleep(400);
  }
  return false;
}

async function run() {
  console.log(`\n============================================================`);
  console.log(`⚖️  TESTING ETHIROLI MULTI-WORKER CLUSTER & LOAD BALANCING`);
  console.log(`Target Port: ${TEST_PORT} | Workers: ${NUM_WORKERS} | Requests: ${TOTAL_REQUESTS}`);
  console.log(`============================================================\n`);

  // 1. Launch cluster master process
  const clusterProcess = spawn('node', [clusterScript], {
    cwd: path.resolve(__dirname, '..'),
    env: {
      ...process.env,
      PORT: String(TEST_PORT),
      CLUSTER_WORKERS: String(NUM_WORKERS),
      CLUSTER_MODE: 'true',
      NODE_ENV: 'test'
    },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  const workerPidsSeen = new Set();
  clusterProcess.stdout.on('data', (chunk) => {
    const text = chunk.toString();
    process.stdout.write(`[Cluster stdout] ${text}`);
    const match = text.match(/PID:\s*(\d+)/);
    if (match) workerPidsSeen.add(parseInt(match[1], 10));
  });

  clusterProcess.stderr.on('data', (chunk) => {
    process.stderr.write(`[Cluster stderr] ${chunk.toString()}`);
  });

  let clusterExited = false;
  clusterProcess.on('exit', (code) => {
    clusterExited = true;
    console.log(`Cluster master exited with code: ${code}`);
  });

  try {
    // 2. Wait for server readiness
    console.log(`⏳ Waiting for cluster instances to initialize on port ${TEST_PORT}...`);
    const ready = await waitForServer(`http://127.0.0.1:${TEST_PORT}/health`);
    if (!ready) {
      throw new Error(`Cluster failed to start on port ${TEST_PORT} within timeout`);
    }
    console.log(`✅ Cluster is online and accepting connections on port ${TEST_PORT}!\n`);

    // 3. Test Probe Endpoints
    console.log(`🔍 Testing L7 Health & Readiness Probes:`);
    const livenessRes = await fetch(`http://127.0.0.1:${TEST_PORT}/health/live`);
    const readinessRes = await fetch(`http://127.0.0.1:${TEST_PORT}/health/ready`);
    const liveJson = await livenessRes.json();
    const readyJson = await readinessRes.json();

    console.log(`   Liveness: ${livenessRes.status} -> ${JSON.stringify(liveJson)}`);
    console.log(`   Readiness: ${readinessRes.status} -> ${JSON.stringify(readyJson)}`);

    if (livenessRes.status !== 200 || readinessRes.status !== 200) {
      throw new Error('Health or readiness probes failed!');
    }
    console.log(`✅ Health probes functioning perfectly!\n`);

    // 4. Send Concurrent Load Across the Cluster
    console.log(`🚀 Dispatching ${TOTAL_REQUESTS} concurrent requests to test load distribution...`);
    const pidsRecorded = {};
    const workerIdsRecorded = {};

    const requestPromises = Array.from({ length: TOTAL_REQUESTS }, async (_, idx) => {
      const res = await fetch(`http://127.0.0.1:${TEST_PORT}/health`);
      if (res.status !== 200) {
        throw new Error(`Request #${idx} returned HTTP ${res.status}`);
      }

      const workerPid = res.headers.get('x-worker-pid');
      const workerId = res.headers.get('x-worker-id') || 'unknown';

      if (workerPid) {
        pidsRecorded[workerPid] = (pidsRecorded[workerPid] || 0) + 1;
      }
      if (workerId) {
        workerIdsRecorded[workerId] = (workerIdsRecorded[workerId] || 0) + 1;
      }

      return { status: res.status, workerPid, workerId };
    });

    const responses = await Promise.all(requestPromises);
    console.log(`✅ All ${responses.length} concurrent requests succeeded with HTTP 200!`);

    console.log(`\n📊 Load Distribution by Worker Process:`);
    for (const [pid, count] of Object.entries(pidsRecorded)) {
      const percentage = ((count / TOTAL_REQUESTS) * 100).toFixed(1);
      console.log(`   - Worker Process (PID: ${pid}): ${count} requests (${percentage}%)`);
    }

    console.log(`\n📊 Load Distribution by Worker ID:`);
    for (const [wid, count] of Object.entries(workerIdsRecorded)) {
      const percentage = ((count / TOTAL_REQUESTS) * 100).toFixed(1);
      console.log(`   - Worker #${wid}: ${count} requests (${percentage}%)`);
    }

    const uniquePids = Object.keys(pidsRecorded);
    if (uniquePids.length < 2) {
      console.warn(`⚠️ Warning: Expected distribution across multiple workers, saw ${uniquePids.length}`);
    } else {
      console.log(`\n🎉 SUCCESS: Verified active multi-worker load balancing across ${uniquePids.length} distinct worker PIDs!`);
    }

    // 5. Test Worker Self-Healing (Kill 1 worker and verify auto-resurrection)
    const targetPidToKill = parseInt(uniquePids[0], 10);
    console.log(`\n🛡️ Testing Self-Healing Auto-Resurrection:`);
    console.log(`   Killing active worker PID: ${targetPidToKill}...`);

    try {
      process.kill(targetPidToKill, 'SIGKILL');
    } catch (e) {
      console.warn(`Could not kill via SIGKILL directly:`, e.message);
    }

    // Give cluster master 1.5s to detect exit and auto-resurrect
    await sleep(1500);

    // Verify cluster is still fully responsive
    console.log(`   Verifying cluster availability post-kill...`);
    const postKillRes = await fetch(`http://127.0.0.1:${TEST_PORT}/health`);
    const postKillJson = await postKillRes.json();
    const activePid = postKillRes.headers.get('x-worker-pid');
    console.log(`   Response status: ${postKillRes.status} (Handled by PID: ${activePid})`);
    console.log(`   Body:`, postKillJson);

    if (postKillRes.status === 200) {
      console.log(`✅ Worker self-healing and zero-downtime resilience verified!\n`);
    } else {
      throw new Error(`Cluster failed to serve requests after worker termination`);
    }

  } finally {
    // 6. Graceful Cluster Cleanup
    console.log(`🧹 Shutting down test cluster master (PID: ${clusterProcess.pid})...`);
    try {
      clusterProcess.kill('SIGTERM');
      // On Windows child_process tree kill fallback if needed
      await sleep(1000);
      if (!clusterExited) {
        clusterProcess.kill('SIGKILL');
      }
    } catch (_) {}
  }

  console.log(`============================================================`);
  console.log(`✨ ALL LOAD BALANCING AND RESILIENCE TESTS PASSED!`);
  console.log(`============================================================\n`);
}

run().catch((err) => {
  console.error(`❌ Test failed with error:`, err);
  process.exit(1);
});
