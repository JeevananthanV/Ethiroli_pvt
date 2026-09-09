import express from 'express';
import { listAttendance, checkIn, checkOut, manualCorrect, getAttendanceSummary } from '../controllers/attendanceController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

router.get('/attendance', requireRole('HR', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), listAttendance);
router.post('/attendance/check-in', requireRole('SUPER_ADMIN', 'ADMIN', 'HR', 'RECEPTION', 'EMPLOYEE', 'INTERN'), validateBody('createAttendance'), checkIn);
router.post('/attendance/check-out', requireRole('SUPER_ADMIN', 'ADMIN', 'HR', 'RECEPTION', 'EMPLOYEE', 'INTERN'), validateBody('createAttendance'), checkOut);
router.patch('/attendance/:id', requireRole('HR', 'ADMIN'), validateBody('createAttendance'), manualCorrect);
router.get('/attendance/summary', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), getAttendanceSummary);

export default router;
