import express from 'express';
import {
  listAttendance, checkIn, checkOut, manualCorrect, getAttendanceSummary, getAttendanceById, deleteAttendance,
  getMyTodayAttendance, getMyAttendanceHistory, punchMyAttendance,
} from '../controllers/attendanceController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const SELF_ROLES = ['SUPER_ADMIN', 'ADMIN', 'HR', 'RECEPTION', 'EMPLOYEE', 'INTERN', 'STUDENT', 'TUTOR'];

const router = express.Router();
router.use(authenticate);

router.get('/attendance', requireRole('HR', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION', 'EMPLOYEE', 'INTERN', 'STUDENT', 'TUTOR'), listAttendance);
router.post('/attendance/check-in', requireRole('SUPER_ADMIN', 'ADMIN', 'HR', 'RECEPTION', 'EMPLOYEE', 'INTERN', 'STUDENT', 'TUTOR'), validateBody('createAttendance'), checkIn);
router.post('/attendance/check-out', requireRole('SUPER_ADMIN', 'ADMIN', 'HR', 'RECEPTION', 'EMPLOYEE', 'INTERN', 'STUDENT', 'TUTOR'), validateBody('createAttendance'), checkOut);
router.get('/attendance/summary', requireRole('HR', 'ADMIN', 'SUPER_ADMIN', 'EMPLOYEE', 'INTERN', 'STUDENT', 'TUTOR'), getAttendanceSummary);

// Self-scoped punch-clock surface. These MUST stay above `/attendance/:id`,
// otherwise Express matches ":id" first and "today"/"history" are treated as
// record ids.
router.get('/attendance/today', requireRole(...SELF_ROLES), getMyTodayAttendance);
router.get('/attendance/history', requireRole(...SELF_ROLES), getMyAttendanceHistory);
router.post('/attendance/punch', requireRole(...SELF_ROLES), punchMyAttendance);

router.get('/attendance/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), getAttendanceById);
router.put('/attendance/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), validateBody('updateAttendance'), manualCorrect);
router.patch('/attendance/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), validateBody('updateAttendance'), manualCorrect);
router.delete('/attendance/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), deleteAttendance);

export default router;

