import express from 'express';
import { listSubscriptions, createSubscription, updateSubscription } from '../controllers/subscriptionController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();
router.use(authenticate);

router.get('/subscriptions', requireRole('PROJECT_MANAGER', 'FINANCE', 'ADMIN', 'SUPER_ADMIN'), listSubscriptions);
router.post('/subscriptions', requireRole('PROJECT_MANAGER', 'ADMIN'), createSubscription);
router.patch('/subscriptions/:id', requireRole('PROJECT_MANAGER', 'ADMIN'), updateSubscription);

export default router;
