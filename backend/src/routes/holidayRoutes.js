import express from 'express';
import { listHolidays, createHoliday, getHoliday, updateHoliday, deleteHoliday } from '../controllers/holidayController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

router.get('/calendar/holidays', requireRole('EMPLOYEE', 'INTERN', 'HR', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), listHolidays);
router.post('/calendar/holidays', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), validateBody('createHoliday'), createHoliday);
router.get('/calendar/holidays/:id', requireRole('EMPLOYEE', 'INTERN', 'HR', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), getHoliday);
router.patch('/calendar/holidays/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), validateBody('createHoliday'), updateHoliday);
router.delete('/calendar/holidays/:id', requireRole('ADMIN', 'SUPER_ADMIN'), deleteHoliday);

export default router;
