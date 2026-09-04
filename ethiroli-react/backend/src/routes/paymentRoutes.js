import express from 'express';
import { listPayments, recordPayment, razorpayWebhook, stripeWebhook } from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Webhooks are public
router.post('/payments/webhook/razorpay', razorpayWebhook);
router.post('/payments/webhook/stripe', stripeWebhook);

router.get('/payments', authenticate, listPayments);
router.post('/payments', authenticate, recordPayment);

export default router;
