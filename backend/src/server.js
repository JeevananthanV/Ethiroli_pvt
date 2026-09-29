import 'dotenv/config';
import http from 'http';
import app from './app.js';
import { attachSocket } from './socket/index.js';
import pool, { logPoolStatus } from './config/database.js';
import { getRedisClient, closeRedisConnection, checkRedisHealth } from './config/redis.js';
import { gracefulShutdown as telemetryShutdown, checkTelemetryHealth } from './services/telemetryService.js';
import { gracefulShutdown as completionShutdown } from './services/completionService.js';
import bcrypt from 'bcryptjs';

const PORT = process.env.PORT || 5000;
const SHUTDOWN_TIMEOUT_MS = Number(process.env.SHUTDOWN_TIMEOUT_MS || 10000);

// Remove MITM risk: only allow self-signed certs in explicit dev mode
// if (process.env.NODE_ENV === 'development' && process.env.ALLOW_SELF_SIGNED_CERTS === 'true') {
//   https.globalAgent.options.rejectUnauthorized = false;
// }

let isShuttingDown = false;
let server = null;
let io = null;

const gracefulShutdown = (signal) => {
  if (isShuttingDown) {
    console.log(`${signal} received again. Forcing exit.`);
    process.exit(1);
  }

  isShuttingDown = true;
  console.log(`${signal} received. Starting graceful shutdown...`);

  const closeServers = async () => {
    try {
      if (server) {
        console.log('Closing HTTP & WebSocket server...');
        await new Promise((resolve) => {
          server.close(() => {
            console.log('HTTP & WebSocket server closed.');
            resolve();
          });
          setTimeout(resolve, SHUTDOWN_TIMEOUT_MS);
        });
      }

      console.log('Closing database connections...');
      await pool.end();
      console.log('Database connections closed.');

      console.log('Closing Redis connection...');
      await closeRedisConnection();
      console.log('Redis connection closed.');

      console.log('Disconnecting Kafka producers...');
      await telemetryShutdown(signal);
      await completionShutdown(signal);
      console.log('Kafka producers disconnected.');

      console.log('Graceful shutdown complete.');
      process.exit(0);
    } catch (error) {
      console.error('Error during graceful shutdown:', error);
      process.exit(1);
    }
  };

  closeServers();
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

const seedAdminUser = async () => {
  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.log('Skipping admin seed: SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD not set.');
    return;
  }

  try {
    const [rows] = await pool.execute(
      "SELECT id FROM users WHERE email = ? OR role = 'SUPER_ADMIN' LIMIT 1",
      [adminEmail]
    );

    if (rows.length === 0) {
      const { default: User } = await import('./models/User.js');
      const passwordHash = await bcrypt.hash(adminPassword, 12);
      const id = await User.create({
        email: adminEmail,
        password_hash: passwordHash,
        full_name: 'Super Administrator',
        role: 'SUPER_ADMIN'
      });
      console.log(`Seeded default SUPER_ADMIN user with id: ${id}`);
    }
  } catch (error) {
    console.error('Error seeding default admin user:', error);
  }
};

const startServers = async () => {
  try {
    await pool.execute('SELECT 1 AS health_check');
    console.log('Database connectivity verified.');

    // Redis health check — non-fatal, server starts regardless
    try {
      const redisClient = getRedisClient();
      if (redisClient) {
        const redisHealth = await checkRedisHealth(redisClient);
        console.log('Redis connectivity verified.', { status: redisHealth.connected ? 'healthy' : 'unhealthy', latencyMs: redisHealth.latencyMs });
      } else {
        console.log('Redis is disabled (REDIS_ENABLED=false) — skipping health check.');
      }
    } catch (redisError) {
      console.warn('[NON-FATAL] Redis health check failed — app will continue without Redis:', redisError.message);
    }

    // Telemetry (Kafka) health check — non-fatal, server starts regardless
    try {
      const telemetryHealth = await checkTelemetryHealth();
      console.log('Telemetry health check completed.', { status: telemetryHealth.status });
    } catch (telemetryError) {
      console.warn('[NON-FATAL] Telemetry health check failed — app will continue without Kafka:', telemetryError.message);
    }

    server = http.createServer(app);
    io = attachSocket(server);

    server.listen(PORT, '0.0.0.0', async () => {
      console.log(`API & WebSocket Server running on port ${PORT}`);
      await seedAdminUser();
    });

    setInterval(() => {
      logPoolStatus(pool);
    }, 5 * 60 * 1000);

    return { server, io };
  } catch (error) {
    console.error('Failed to start servers:', error);
    process.exit(1);
  }
};

startServers();