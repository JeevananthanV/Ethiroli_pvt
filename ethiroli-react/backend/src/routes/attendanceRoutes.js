import express from 'express';
import { listAttendance, checkIn, checkOut, manualCorrect } from '../controllers/attendanceController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();
router.use(authenticate);

router.get('/attendance', listAttendance);
router.post('/attendance/check-in', checkIn);
router.post('/attendance/check-out', checkOut);
router.patch('/attendance/:id', requireRole('HR', 'ADMIN'), manualCorrect);

export default router;
