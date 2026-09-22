import pool from '../config/database.js';
import { success } from '../utils/response.js';

/**
 * Performs a lightweight database connectivity check.
 * @returns {Promise<{connected: boolean, latencyMs: number, error?: string}>}
 */
const checkDatabaseHealth = async () => {
  const start = Date.now();
  try {
    await pool.execute('SELECT 1 AS health_check');
    return { connected: true, latencyMs: Date.now() - start };
  } catch (error) {
    return { connected: false, latencyMs: Date.now() - start, error: error.message };
  }
};

/**
 * Basic health check endpoint.
 * Returns application status and current timestamp.
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 */
export const getHealth = (req, res) => {
  success(res, 200, {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  }, 'Service is healthy');
};

/**
 * Liveness probe endpoint.
 * Used by Kubernetes or load balancers to determine if the server should be restarted.
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 */
export const getLiveness = (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  success(res, 200, {
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  }, 'Service is alive');
};

/**
 * Readiness probe endpoint.
 * Verifies that the application is ready to accept traffic (database connectivity, etc.).
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
export const getReadiness = async (req, res, next) => {
  try {
    const dbHealth = await checkDatabaseHealth();

    if (!dbHealth.connected) {
      return success(res, 503, {
        status: 'not_ready',
        timestamp: new Date().toISOString(),
        database: dbHealth
      }, 'Service is not ready: database connectivity check failed');
    }

    success(res, 200, {
      status: 'ready',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbHealth
    }, 'Service is ready to accept traffic');
  } catch (error) {
    next(error);
  }
};
