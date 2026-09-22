import express from 'express';
import { listPayments, recordPayment, razorpayWebhook, stripeWebhook } from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';
import { authenticateApiKey } from '../middleware/apiKeyAuth.js';

const router = express.Router();

router.post('/payments/webhook/razorpay', authenticateApiKey, razorpayWebhook);
router.post('/payments/webhook/stripe', authenticateApiKey, stripeWebhook);

router.get('/payments', authenticate, requireRole('SUPER_ADMIN', 'ADMIN', 'FINANCE'), listPayments);
router.post('/payments', authenticate, requireRole('SUPER_ADMIN', 'ADMIN', 'FINANCE'), validateBody('createPayment'), recordPayment);

export default router;
