import express from 'express';
import { getDashboardMetrics } from '../controllers/hrDashboardController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();
router.use(authenticate);

router.get('/hr/dashboard/metrics', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), getDashboardMetrics);

export default router;
