import express from 'express';
import { listSchedules, createSchedule, getSchedule, updateSchedule, runNow, pauseSchedule } from '../controllers/scheduledReportController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

router.get('/reports/schedules', requireRole('ADMIN', 'SUPER_ADMIN'), listSchedules);
router.post('/reports/schedules', requireRole('ADMIN', 'SUPER_ADMIN'), validateBody('createScheduledReport'), createSchedule);
router.get('/reports/schedules/:id', requireRole('ADMIN', 'SUPER_ADMIN'), getSchedule);
router.patch('/reports/schedules/:id', requireRole('ADMIN', 'SUPER_ADMIN'), validateBody('createScheduledReport'), updateSchedule);
router.post('/reports/schedules/:id/run', requireRole('ADMIN', 'SUPER_ADMIN'), runNow);
router.post('/reports/schedules/:id/pause', requireRole('ADMIN', 'SUPER_ADMIN'), validateBody('pauseSchedule'), pauseSchedule);

export default router;
