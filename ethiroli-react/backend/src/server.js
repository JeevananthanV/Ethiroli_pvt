import 'dotenv/config';
import http from 'http';
import https from 'https';
import app from './app.js';
import { httpServer as socketHttpServer, io } from './socket/index.js';
import pool, { logPoolStatus } from './config/database.js';
import bcrypt from 'bcrypt';

const PORT = process.env.PORT || 5000;
const SOCKET_PORT = 3003;
const SHUTDOWN_TIMEOUT_MS = Number(process.env.SHUTDOWN_TIMEOUT_MS || 10000);

// Remove MITM risk: only allow self-signed certs in explicit dev mode
// if (process.env.NODE_ENV === 'development' && process.env.ALLOW_SELF_SIGNED_CERTS === 'true') {
//   https.globalAgent.options.rejectUnauthorized = false;
// }

let isShuttingDown = false;

const gracefulShutdown = (signal) => {
  if (isShuttingDown) {
    console.log(`${signal} received again. Forcing exit.`);
    process.exit(1);
  }

  isShuttingDown = true;
  console.log(`${signal} received. Starting graceful shutdown...`);

  const closeServers = async () => {
    try {
      console.log('Closing Socket.IO server...');
      await new Promise((resolve) => {
        socketHttpServer.close(() => {
          console.log('Socket.IO server closed.');
          resolve();
        });
        setTimeout(resolve, SHUTDOWN_TIMEOUT_MS);
      });

      console.log('Closing HTTP server...');
      await new Promise((resolve) => {
        server.close(() => {
          console.log('HTTP server closed.');
          resolve();
        });
        setTimeout(resolve, SHUTDOWN_TIMEOUT_MS);
      });

      console.log('Closing database connections...');
      await pool.end();
      console.log('Database connections closed.');

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

    const server = app.listen(PORT, async () => {
      console.log(`API Server running on http://localhost:${PORT}`);
      await seedAdminUser();
    });

    console.log(`Socket.IO Server running on http://localhost:${SOCKET_PORT}`);

    setInterval(() => {
      logPoolStatus(pool);
    }, 5 * 60 * 1000);

    return { server, socketHttpServer, io };
  } catch (error) {
    console.error('Failed to start servers:', error);
    process.exit(1);
  }
};

startServers();
