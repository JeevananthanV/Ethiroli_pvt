import express from 'express';
import { getHealth, getLiveness, getReadiness } from '../controllers/healthController.js';

const router = express.Router();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Basic health check
 *     description: Returns the service health status and timestamp.
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: ok
 *                     timestamp:
 *                       type: string
 *                       example: 2026-01-01T00:00:00.000Z
 *                     uptime:
 *                       type: number
 *                       example: 12345
 */
router.get('/', getHealth);

/**
 * @openapi
 * /health/live:
 *   get:
 *     summary: Liveness probe
 *     description: Used by Kubernetes or load balancers to determine if the process should be restarted.
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is alive
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: alive
 *                     timestamp:
 *                       type: string
 *                     uptime:
 *                       type: number
 */
router.get('/live', getLiveness);

/**
 * @openapi
 * /health/ready:
 *   get:
 *     summary: Readiness probe
 *     description: Verifies that the application is ready to accept traffic (database connectivity, etc.).
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is ready
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: ready
 *                     database:
 *                       type: object
 *                       properties:
 *                         connected:
 *                           type: boolean
 *                         latencyMs:
 *                           type: number
 *       503:
 *         description: Service is not ready (database unreachable)
 */
router.get('/ready', getReadiness);

export default router;
