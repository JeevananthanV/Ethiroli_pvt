import express from 'express';
import { listHolidays, createHoliday, getHoliday, updateHoliday, deleteHoliday } from '../controllers/holidayController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

// Calendar holidays aliases
router.get('/calendar/holidays', requireRole('EMPLOYEE', 'INTERN', 'HR', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), listHolidays);
router.post('/calendar/holidays', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), validateBody('createHoliday'), createHoliday);
router.get('/calendar/holidays/:id', requireRole('EMPLOYEE', 'INTERN', 'HR', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), getHoliday);
router.put('/calendar/holidays/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), validateBody('updateHoliday'), updateHoliday);
router.patch('/calendar/holidays/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), validateBody('updateHoliday'), updateHoliday);
router.delete('/calendar/holidays/:id', requireRole('ADMIN', 'SUPER_ADMIN', 'HR'), deleteHoliday);

// Direct /holidays routes
router.get('/holidays', requireRole('EMPLOYEE', 'INTERN', 'HR', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), listHolidays);
router.post('/holidays', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), validateBody('createHoliday'), createHoliday);
router.get('/holidays/:id', requireRole('EMPLOYEE', 'INTERN', 'HR', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), getHoliday);
router.put('/holidays/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), validateBody('updateHoliday'), updateHoliday);
router.patch('/holidays/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), validateBody('updateHoliday'), updateHoliday);
router.delete('/holidays/:id', requireRole('ADMIN', 'SUPER_ADMIN', 'HR'), deleteHoliday);

export default router;

