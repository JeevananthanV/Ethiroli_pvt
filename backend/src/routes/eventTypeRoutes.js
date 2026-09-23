import express from 'express';
import {
  listEventTypes,
  getEventType,
  createEventType,
  updateEventType,
  deleteEventType
} from '../controllers/eventTypeController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

router.use(authenticate);

// Publicly read event types for all logged-in roles
router.get('/calendar/types', listEventTypes);
router.get('/calendar/types/:id', getEventType);

// Admin-managed CRUD
router.post('/calendar/types', requireRole('ADMIN', 'SUPER_ADMIN'), createEventType);
router.patch('/calendar/types/:id', requireRole('ADMIN', 'SUPER_ADMIN'), updateEventType);
router.put('/calendar/types/:id', requireRole('ADMIN', 'SUPER_ADMIN'), updateEventType);
router.delete('/calendar/types/:id', requireRole('ADMIN', 'SUPER_ADMIN'), deleteEventType);

export default router;
