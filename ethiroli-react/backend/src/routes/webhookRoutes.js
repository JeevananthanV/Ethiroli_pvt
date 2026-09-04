import express from 'express';
import { listWebhooks, createWebhook } from '../controllers/webhookSubscriptionController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/developer/webhooks', listWebhooks);
router.post('/developer/webhooks', createWebhook);

export default router;
