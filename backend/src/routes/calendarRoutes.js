import express from 'express';
import {
  listEvents,
  listExpanded,
  createEvent,
  getEvent,
  updateEvent,
  deleteEvent,
  listEventTypes,
  createRecurrence,
  getInstances,
  skipInstance,
  cancelInstance,
  getRoleConfig,
  updateRoleConfig
} from '../controllers/calendarController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

router.use(authenticate);

// 1. Role-aware Calendar Config
router.get('/calendar/config', getRoleConfig);
router.patch('/calendar/config', requireRole('ADMIN', 'SUPER_ADMIN'), updateRoleConfig);

// 2. Event Types (backward compatibility)
router.get('/calendar/event-types', listEventTypes);

// 3. Expanded Calendar Events View (combines base + recurring instances in date range)
router.get('/calendar/expand', listExpanded);

// 4. Main Event CRUD (Accessible to all active roles, validated per event type in controller)
router.get('/calendar/events', listEvents);
router.post('/calendar/events', createEvent);
router.get('/calendar/events/:id', getEvent);
router.patch('/calendar/events/:id', updateEvent);
router.put('/calendar/events/:id', updateEvent);
router.delete('/calendar/events/:id', deleteEvent);

// 5. Recurring Engine Management
router.post('/calendar/events/:id/recur', createRecurrence);
router.get('/calendar/events/:id/instances', getInstances);
router.post('/calendar/instances/:id/skip', skipInstance);
router.post('/calendar/instances/:id/cancel', cancelInstance);

export default router;