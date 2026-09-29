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

const WORKERS = configuredWorkers > 0 ? configuredWorkers : Math.max(2, Math.min(numCPUs, 4));

let getClusterStatus;

if (cluster.isPrimary) {
  console.log('\n========================================================');
  console.log('? ETHIROLI CLUSTER LOAD BALANCER PRIMARY INITIATED');
  console.log(`Master PID: ${process.pid} | Detected CPUs: ${numCPUs} | Target Workers: ${WORKERS}`);
  console.log(`Node Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('========================================================\n');

  try {
    setupPrimary();
    console.log('? Socket.IO Cluster Primary IPC Adapter configured');
  } catch (err) {
    console.warn('? Socket.IO Primary setup:', err.message);
  }

  const workerInfo = new Map();
  let isShuttingDown = false;
  let drainMode = false;

  const getWorkerMetrics = (worker) => {
    const info = workerInfo.get(worker.id);
    if (!info) return null;

    return {
      ...info,
      pid: worker.process.pid,
      uptime: Date.now() - info.startTime,
      lastHeartbeat: info.lastHeartbeat,
      restartCount: info.restartCount || 0,
      healthy: info.healthy || false,
      responding: info.responding || false,
      memory: info.memory || { rss: 0, heapTotal: 0, heapUsed: 0, external: 0 }
    };
  };

  const sendHealthCheck = (worker) => {
    const metrics = getWorkerMetrics(worker);
    if (!metrics) return;

    try {
      worker.send({ type: 'HEALTH_CHECK', payload: { workerId: metrics.index, requestMemory: true } });
      metrics.responding = true;
      workerInfo.set(worker.id, metrics);
      console.log('? Health check sent to Worker #' + metrics.index);
    } catch (err) {
      console.error('? Failed to send health check to Worker #' + (metrics?.index || worker.id), err.message);
      const updatedMetrics = { ...metrics, responding: false };
      workerInfo.set(worker.id, updatedMetrics);
    }
  };

  const performHealthChecks = () => {
    for (const [id, worker] of Object.entries(cluster.workers || {})) {
      if (worker && !isShuttingDown && !drainMode) {
        sendHealthCheck(worker);
      }
    }
  };

  const forkWorker = (index) => {
    const worker = cluster.fork({
      CLUSTER_MODE: 'true',
      CLUSTER_WORKER_ID: String(index + 1)
    });

    const newMetrics = {
      index: index + 1,
      pid: worker.process.pid,
      startTime: Date.now(),
      lastHeartbeat: Date.now(),
      restartCount: 0,
      healthy: false,
      responding: false,
      memory: { rss: 0, heapTotal: 0, heapUsed: 0, external: 0 }
    };
    workerInfo.set(worker.id, newMetrics);

    return worker;
  };

  const checkWorkerHealth = (worker) => {
    const metrics = getWorkerMetrics(worker);
    if (!metrics) return false;

    const now = Date.now();
    const isExpired = now - metrics.lastHeartbeat > 65000;

    const isUnhealthy = isExpired || !metrics.responding;
    const wasHealthy = metrics.healthy;

    metrics.healthy = !isUnhealthy;

    workerInfo.set(worker.id, metrics);

    if (isUnhealthy && wasHealthy) {
      console.warn(
        `? Worker #${metrics.index} (PID: ${metrics.pid}) became unhealthy - ` +
        `last heartbeat: ${Math.round((now - metrics.lastHeartbeat) / 1000)}s ago`
      );
    } else if (!isUnhealthy && !wasHealthy) {
      console.log(`? Worker #${metrics.index} (PID: ${metrics.pid}) recovered and is healthy`);
    }

    return !isUnhealthy;
  };

  const handleWorkerRestart = (worker, reason) => {
    const metrics = getWorkerMetrics(worker);
    console.warn(
      `? Worker #${metrics?.index || worker.id} (PID: ${metrics?.pid || worker.process.pid}) ` +
      `restarted due to ${reason}`
    );

    const updatedMetrics = { ...metrics };
    if (updatedMetrics) {
      updatedMetrics.restartCount = (updatedMetrics.restartCount || 0) + 1;
      updatedMetrics.startTime = Date.now();
      updatedMetrics.lastHeartbeat = Date.now();
      updatedMetrics.healthy = false;
      updatedMetrics.responding = false;
      workerInfo.set(worker.id, updatedMetrics);
    }
  };

  const drain = async () => {
    if (drainMode) return;
    drainMode = true;
    console.log('\n? Entering drain mode - accepting new connections but will not restart failed workers');

    for (const worker of Object.values(cluster.workers || {})) {
      worker.send({ type: 'ENTER_DRAIN_MODE' });
    }
  };

  cluster.on('online', (worker) => {
    const info = workerInfo.get(worker.id);
    console.log(`? Worker #${info?.index || worker.id} is online (PID: ${worker.process.pid})`);
  });

  cluster.on('message', (worker, message) => {
    if (message.type === 'HEARTBEAT') {
      const metrics = getWorkerMetrics(worker);
      if (metrics) {
        if (message.memory) {
          metrics.memory = message.memory;
        }
        metrics.lastHeartbeat = Date.now();
        workerInfo.set(worker.id, metrics);
        console.log(`? Worker #${metrics.index} heartbeat received`);
      }
    } else if (message.type === 'MEMORY_RESPONSE') {
      const metrics = getWorkerMetrics(worker);
      if (metrics) {
        metrics.memory = message.memory;
        workerInfo.set(worker.id, metrics);
      }
    }
  });

  cluster.on('exit', (worker, code, signal) => {
    const info = workerInfo.get(worker.id);
    workerInfo.delete(worker.id);

    if (isShuttingDown) {
      console.log(`? Worker #${info?.index || worker.id} (PID: ${info?.pid || worker.process.pid}) exited cleanly during shutdown.`);
      return;
    }

    console.warn(
      `? Worker #${info?.index || worker.id} (PID: ${info?.pid || worker.process.pid}) died (code: ${code}, signal: ${signal}). Auto-resurrecting replacement worker...`
    );

    if (!drainMode) {
      setTimeout(() => {
        const newWorker = forkWorker(info?.index ? info.index - 1 : 0);
        handleWorkerRestart(newWorker, 'unexpected exit');
      }, 500);
    }
  });

  const rollingRestart = async () => {
    console.log(`\n? Starting zero-downtime rolling restart of all ${WORKERS} workers...`);
    const workerIds = Object.keys(cluster.workers || {});

    for (const id of workerIds) {
      const oldWorker = cluster.workers[id];
      if (!oldWorker) continue;

      const oldInfo = workerInfo.get(oldWorker.id);
      console.log(`? Restarting Worker #${oldInfo?.index || id} (PID: ${oldWorker.process.pid})...`);

      const newWorker = forkWorker(oldInfo?.index ? oldInfo.index - 1 : 0);

      await new Promise((resolve) => {
        const timeout = setTimeout(resolve, 5000);
        newWorker.once('online', () => {
          clearTimeout(timeout);
          resolve();
        });
      });

      oldWorker.disconnect();
      setTimeout(() => {
        if (!oldWorker.isDead()) oldWorker.kill('SIGKILL');
      }, 3000);
    }

    console.log(`? Zero-downtime rolling restart complete!\n`);
  };

  process.on('SIGUSR2', rollingRestart);

  const shutdownCluster = async (signal) => {
    if (isShuttingDown) return;
    isShuttingDown = true;
    console.log(`\n? Master received ${signal}. Initiating graceful shutdown of all cluster workers...`);

    await drain();

    for (const worker of Object.values(cluster.workers || {})) {
      worker.send({ type: 'SHUTDOWN' });
      worker.disconnect();
    }

    setTimeout(() => {
      console.log('Force killing remaining workers and exiting master.');
      process.exit(0);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdownCluster('SIGTERM'));
  process.on('SIGINT', () => shutdownCluster('SIGINT'));

  getClusterStatus = () => {
    const status = {
      primaryPid: process.pid,
      workers: [],
      totalWorkers: 0,
      activeWorkers: 0,
      healthyWorkers: 0,
      unhealthyWorkers: 0,
      isShuttingDown,
      drainMode,
      metrics: {
        totalMemory: process.memoryUsage().rss,
        cpuCount: numCPUs,
        workerLimit: WORKERS
      }
    };

    for (const [id, worker] of Object.entries(cluster.workers || {})) {
      const metrics = getWorkerMetrics(worker);
      if (metrics) {
        status.workers.push(metrics);
        status.activeWorkers++;
        if (metrics.healthy) status.healthyWorkers++;
        else status.unhealthyWorkers++;
      }
    }

    status.totalWorkers = status.activeWorkers;
    return status;
  };

  setInterval(performHealthChecks, 30000);

  setInterval(() => {
    const status = getClusterStatus();
    console.log('? Cluster status: ' + JSON.stringify(status, null, 2));
  }, 300000);

  for (let i = 0; i < WORKERS; i++) {
    forkWorker(i);
  }

  process.getClusterStatus = getClusterStatus;
} else {
  import('./server.js')
    .then(() => {
      console.log(`? Worker process running (PID: ${process.pid}, Worker ID: ${process.env.CLUSTER_WORKER_ID || '1'})`);
      console.log(`? Worker sending periodic heartbeats to primary...`);

      const sendHeartbeat = () => {
        const memoryUsage = process.memoryUsage();
        process.send({ 
          type: 'HEARTBEAT', 
          memory: {
            rss: memoryUsage.rss,
            heapTotal: memoryUsage.heapTotal,
            heapUsed: memoryUsage.heapUsed,
            external: memoryUsage.external
          }
        });
      };

      const heartbeatInterval = setInterval(sendHeartbeat, 10000);
      process.on('disconnect', () => {
        clearInterval(heartbeatInterval);
      });

      process.on('message', (message) => {
        if (message.type === 'MEMORY_REQUEST') {
          const memoryUsage = process.memoryUsage();
          process.send({ 
            type: 'MEMORY_RESPONSE', 
            memory: {
              rss: memoryUsage.rss,
              heapTotal: memoryUsage.heapTotal,
              heapUsed: memoryUsage.heapUsed,
              external: memoryUsage.external
            }
          });
        }
      });
    })
    .catch((err) => {
      console.error(`? Failed to start worker ${process.pid}:`, err);
      process.exit(1);
    });
}

export { getClusterStatus };
