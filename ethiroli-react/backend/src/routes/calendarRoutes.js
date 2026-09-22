import express from 'express';
import { listEvents, createEvent, getEvent, updateEvent, deleteEvent } from '../controllers/calendarController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

router.get('/calendar/events', requireRole('EMPLOYEE', 'INTERN', 'HR', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), listEvents);
router.post('/calendar/events', requireRole('HR', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN'), validateBody('createEvent'), createEvent);
router.get('/calendar/events/:id', requireRole('EMPLOYEE', 'INTERN', 'HR', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), getEvent);
router.patch('/calendar/events/:id', requireRole('HR', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN'), validateBody('createEvent'), updateEvent);
router.delete('/calendar/events/:id', requireRole('ADMIN', 'SUPER_ADMIN'), deleteEvent);

export default router;
