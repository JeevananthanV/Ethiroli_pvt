import Payment from '../models/Payment.js';
import AuditLog from '../models/AuditLog.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';

export const listPayments = asyncHandler(async (req, res) => {
  const list = await Payment.list({ status: req.query.status });
  return success(res, 200, list);
});

export const recordPayment = asyncHandler(async (req, res) => {
  await Payment.create(req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'RECORD_PAYMENT',
    entity_type: 'PAYMENT',
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  return success(res, 201, null, 'Payment recorded');
});

export const razorpayWebhook = asyncHandler(async (req, res) => {
  res.status(200).send('OK');
});

export const stripeWebhook = asyncHandler(async (req, res) => {
  res.status(200).send('OK');
});
