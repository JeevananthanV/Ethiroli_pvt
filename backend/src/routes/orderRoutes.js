import express from 'express';
import {
  listOrders,
  getOrder,
  createOrder,
  updateOrderStatus
} from '../controllers/orderController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';
import { createLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();
const writeLimiter = createLimiter({
  windowMs: 60 * 1000,
  max: 30,
  message: 'Too many order requests. Please slow down.'
});

router.use(authenticate);

/**
 * @route GET /v1/orders
 * @desc List orders for the current tenant
 * @access AUTHENTICATED
 */
router.get('/orders', requireRole('STUDENT', 'ADMIN', 'SUPER_ADMIN', 'SALES', 'EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'RECEPTION'), listOrders);

/**
 * @route GET /v1/orders/:id
 * @desc Get a single order by ID
 * @access AUTHENTICATED
 */
router.get('/orders/:id', requireRole('STUDENT', 'ADMIN', 'SUPER_ADMIN', 'SALES', 'EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'RECEPTION'), getOrder);

/**
 * @route POST /v1/orders
 * @desc Create a new order
 * @access STUDENT, ADMIN, SUPER_ADMIN, SALES
 */
router.post('/orders', requireRole('STUDENT', 'ADMIN', 'SUPER_ADMIN', 'SALES'), writeLimiter, validateBody('createOrder'), createOrder);

/**
 * @route PATCH /v1/orders/:id/status
 * @desc Update order payment status
 * @access ADMIN, SUPER_ADMIN, FINANCE
 */
router.patch('/orders/:id/status', requireRole('ADMIN', 'SUPER_ADMIN', 'FINANCE'), writeLimiter, validateBody('updateOrderStatus'), updateOrderStatus);

export default router;
