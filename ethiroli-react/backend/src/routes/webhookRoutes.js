import express from 'express';
import { listWebhooks, createWebhook, getWebhook, updateWebhook, testWebhook } from '../controllers/webhookSubscriptionController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

router.get('/developer/webhooks', requireRole('ADMIN', 'SUPER_ADMIN'), listWebhooks);
router.post('/developer/webhooks', requireRole('ADMIN', 'SUPER_ADMIN'), validateBody('createWebhook'), createWebhook);
router.get('/developer/webhooks/:id', requireRole('ADMIN', 'SUPER_ADMIN'), getWebhook);
router.patch('/developer/webhooks/:id', requireRole('ADMIN', 'SUPER_ADMIN'), validateBody('createWebhook'), updateWebhook);
router.post('/developer/webhooks/:id/test', requireRole('ADMIN', 'SUPER_ADMIN'), testWebhook);

export default router;
