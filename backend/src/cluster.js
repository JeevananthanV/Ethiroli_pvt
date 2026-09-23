import cluster from 'node:cluster';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { setupPrimary } from '@socket.io/cluster-adapter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const numCPUs = os.cpus().length;
const configuredWorkers = parseInt(
  process.env.CLUSTER_WORKERS || process.env.WEB_CONCURRENCY || '0',
  10
);

// Default to configured value, or CPU count (capped at 4 for standard VPS/machines, minimum 2)
const WORKERS = configuredWorkers > 0 ? configuredWorkers : Math.max(2, Math.min(numCPUs, 4));

if (cluster.isPrimary) {
  console.log(`\n========================================================`);
  console.log(`🚀 ETHIROLI CLUSTER LOAD BALANCER PRIMARY INITIATED`);
  console.log(`Master PID: ${process.pid} | Detected CPUs: ${numCPUs} | Target Workers: ${WORKERS}`);
  console.log(`Node Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`========================================================\n`);

  // Initialize Socket.io Cluster Primary adapter for cross-worker IPC broadcasts
  try {
    setupPrimary();
    console.log(`✅ Socket.IO Cluster Primary IPC Adapter configured`);
  } catch (err) {
    console.warn(`⚠️ Socket.IO Primary setup:`, err.message);
  }

  const workerInfo = new Map();
  let isShuttingDown = false;

  const forkWorker = (index) => {
    const worker = cluster.fork({
      CLUSTER_MODE: 'true',
      CLUSTER_WORKER_ID: String(index + 1)
    });

    workerInfo.set(worker.id, {
      index: index + 1,
      pid: worker.process.pid,
      startTime: Date.now()
    });

    return worker;
  };

  // Fork initial worker pool
  for (let i = 0; i < WORKERS; i++) {
    forkWorker(i);
  }

  cluster.on('online', (worker) => {
    const info = workerInfo.get(worker.id);
    console.log(`🟢 Worker #${info?.index || worker.id} is online (PID: ${worker.process.pid})`);
  });

  // Self-Healing: automatic resurrection on unexpected exit
  cluster.on('exit', (worker, code, signal) => {
    const info = workerInfo.get(worker.id);
    workerInfo.delete(worker.id);

    if (isShuttingDown) {
      console.log(`⏹️ Worker #${info?.index || worker.id} (PID: ${worker.process.pid}) exited cleanly during shutdown.`);
      return;
    }

    console.warn(
      `⚠️ Worker #${info?.index || worker.id} (PID: ${worker.process.pid}) died (code: ${code}, signal: ${signal}). Auto-resurrecting replacement worker...`
    );

    // Fork replacement worker to maintain configured capacity
    setTimeout(() => {
      const newWorker = forkWorker(info?.index ? info.index - 1 : 0);
      console.log(`🔄 Spawned replacement Worker #${info?.index || newWorker.id} (New PID: ${newWorker.process.pid})`);
    }, 500);
  });

  // Zero-Downtime Rolling Reload (SIGUSR2)
  const rollingRestart = async () => {
    console.log(`\n🔄 Starting zero-downtime rolling restart of all ${WORKERS} workers...`);
    const workerIds = Object.keys(cluster.workers || {});

    for (const id of workerIds) {
      const oldWorker = cluster.workers[id];
      if (!oldWorker) continue;

      const oldInfo = workerInfo.get(oldWorker.id);
      console.log(`🔁 Restarting Worker #${oldInfo?.index || id} (PID: ${oldWorker.process.pid})...`);

      // Fork replacement first
      const newWorker = forkWorker(oldInfo?.index ? oldInfo.index - 1 : 0);

      // Wait for new worker to be online before retiring the old one
      await new Promise((resolve) => {
        const timeout = setTimeout(resolve, 5000);
        newWorker.once('online', () => {
          clearTimeout(timeout);
          resolve();
        });
      });

      // Disconnect and retire old worker
      oldWorker.disconnect();
      setTimeout(() => {
        if (!oldWorker.isDead()) oldWorker.kill('SIGKILL');
      }, 3000);
    }

    console.log(`✅ Zero-downtime rolling restart complete!\n`);
  };

  process.on('SIGUSR2', rollingRestart);

  // Graceful shutdown of entire cluster
  const shutdownCluster = (signal) => {
    if (isShuttingDown) return;
    isShuttingDown = true;
    console.log(`\n🛑 Master received ${signal}. Initiating graceful shutdown of all cluster workers...`);

    for (const id in cluster.workers) {
      const worker = cluster.workers[id];
      if (worker) {
        worker.send({ type: 'SHUTDOWN' });
        worker.disconnect();
      }
    }

    setTimeout(() => {
      console.log('Force killing remaining workers and exiting master.');
      process.exit(0);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdownCluster('SIGTERM'));
  process.on('SIGINT', () => shutdownCluster('SIGINT'));

} else {
  // Worker process execution: Import the main Express & Socket.io server
  import('./server.js')
    .then(() => {
      console.log(`⚡ Worker process running (PID: ${process.pid}, Worker ID: ${process.env.CLUSTER_WORKER_ID || '1'})`);
    })
    .catch((err) => {
      console.error(`💥 Failed to start worker ${process.pid}:`, err);
      process.exit(1);
    });
}
