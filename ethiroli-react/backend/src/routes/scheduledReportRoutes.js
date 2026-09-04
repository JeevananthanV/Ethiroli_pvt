import express from 'express';
import { listSchedules, createSchedule } from '../controllers/scheduledReportController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/reports/schedules', listSchedules);
router.post('/reports/schedules', createSchedule);

export default router;
