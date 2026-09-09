import express from 'express';
import { listSubscriptions, createSubscription, getSubscription, updateSubscription, cancelSubscription, pauseSubscription, resumeSubscription } from '../controllers/subscriptionController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();

router.use(authenticate);

router.get('/subscriptions', requireRole('PROJECT_MANAGER', 'FINANCE', 'ADMIN', 'SUPER_ADMIN'), listSubscriptions);
router.post('/subscriptions', requireRole('PROJECT_MANAGER', 'ADMIN'), validateBody('createSubscription'), createSubscription);
router.get('/subscriptions/:id', requireRole('PROJECT_MANAGER', 'FINANCE', 'ADMIN', 'SUPER_ADMIN'), getSubscription);
router.patch('/subscriptions/:id', requireRole('PROJECT_MANAGER', 'ADMIN'), validateBody('createSubscription'), updateSubscription);
router.post('/subscriptions/:id/cancel', requireRole('PROJECT_MANAGER', 'ADMIN'), validateBody('cancelSubscription'), cancelSubscription);
router.post('/subscriptions/:id/pause', requireRole('PROJECT_MANAGER', 'ADMIN'), validateBody('pauseSubscription'), pauseSubscription);
router.post('/subscriptions/:id/resume', requireRole('PROJECT_MANAGER', 'ADMIN'), validateBody('resumeSubscription'), resumeSubscription);

export default router;
