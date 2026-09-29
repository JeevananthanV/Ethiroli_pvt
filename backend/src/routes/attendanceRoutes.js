import express from 'express';
import { listAttendance, checkIn, checkOut, manualCorrect, getAttendanceSummary, getAttendanceById, deleteAttendance } from '../controllers/attendanceController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

router.get('/attendance', requireRole('HR', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION', 'EMPLOYEE', 'INTERN', 'STUDENT', 'TUTOR'), listAttendance);
router.post('/attendance/check-in', requireRole('SUPER_ADMIN', 'ADMIN', 'HR', 'RECEPTION', 'EMPLOYEE', 'INTERN', 'STUDENT', 'TUTOR'), validateBody('createAttendance'), checkIn);
router.post('/attendance/check-out', requireRole('SUPER_ADMIN', 'ADMIN', 'HR', 'RECEPTION', 'EMPLOYEE', 'INTERN', 'STUDENT', 'TUTOR'), validateBody('createAttendance'), checkOut);
router.get('/attendance/summary', requireRole('HR', 'ADMIN', 'SUPER_ADMIN', 'EMPLOYEE', 'INTERN', 'STUDENT', 'TUTOR'), getAttendanceSummary);
router.get('/attendance/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), getAttendanceById);
router.put('/attendance/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), validateBody('updateAttendance'), manualCorrect);
router.patch('/attendance/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), validateBody('updateAttendance'), manualCorrect);
router.delete('/attendance/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), deleteAttendance);

export default router;

