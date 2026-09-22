import express from 'express';
import {
  listRecurringSchedules,
  getRecurringSchedule,
  createRecurringSchedule,
  updateRecurringSchedule,
  deleteRecurringSchedule
} from '../controllers/recurringScheduleController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';
import { createLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();
const writeLimiter = createLimiter({
  windowMs: 60 * 1000,
  max: 30,
  message: 'Too many recurring schedule requests. Please slow down.'
});

router.use(authenticate);

/**
 * @route GET /v1/recurring-schedules
 * @desc List recurring schedules
 * @access ADMIN, SUPER_ADMIN, FINANCE
 */
router.get('/recurring-schedules', requireRole('ADMIN', 'SUPER_ADMIN', 'FINANCE'), listRecurringSchedules);

/**
 * @route GET /v1/recurring-schedules/:id
 * @desc Get a recurring schedule by ID
 * @access ADMIN, SUPER_ADMIN, FINANCE
 */
router.get('/recurring-schedules/:id', requireRole('ADMIN', 'SUPER_ADMIN', 'FINANCE'), getRecurringSchedule);

/**
 * @route POST /v1/recurring-schedules
 * @desc Create a recurring schedule
 * @access ADMIN, SUPER_ADMIN, FINANCE
 */
router.post('/recurring-schedules', requireRole('ADMIN', 'SUPER_ADMIN', 'FINANCE'), writeLimiter, validateBody('createRecurringSchedule'), createRecurringSchedule);

/**
 * @route PATCH /v1/recurring-schedules/:id
 * @desc Update a recurring schedule
 * @access ADMIN, SUPER_ADMIN, FINANCE
 */
router.patch('/recurring-schedules/:id', requireRole('ADMIN', 'SUPER_ADMIN', 'FINANCE'), writeLimiter, validateBody('createRecurringSchedule'), updateRecurringSchedule);

/**
 * @route DELETE /v1/recurring-schedules/:id
 * @desc Delete a recurring schedule
 * @access ADMIN, SUPER_ADMIN
 */
router.delete('/recurring-schedules/:id', requireRole('ADMIN', 'SUPER_ADMIN'), writeLimiter, deleteRecurringSchedule);

export default router;
