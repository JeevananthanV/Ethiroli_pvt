import crypto from 'crypto';
import pool from '../config/database.js';
import { logger } from '../config/logger.js';

export const processWebhook = async (event, payload) => {
  logger.info('Processing webhook', { event });

  try {
    const [result] = await pool.execute(
      `INSERT INTO webhook_subscriptions (event, payload, processed, created_at)
       VALUES (?, ?, FALSE, CURRENT_TIMESTAMP)`,
      [event, JSON.stringify(payload)]
    );

    logger.info('Webhook processed and queued', { event, webhookId: result.insertId });
    return { success: true, webhookId: result.insertId, event };
  } catch (error) {
    logger.error('Webhook processing failed', { event, error: error.message });
    throw error;
  }
};

export const verifySignature = (headers, payload, secret) => {
  const signature = headers['x-webhook-signature'] || headers['X-Webhook-Signature'];

  if (!signature) {
    throw new Error('Missing webhook signature');
  }

  if (!secret) {
    throw new Error('Webhook secret not configured');
  }

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');

  if (signature !== expectedSignature) {
    throw new Error('Invalid webhook signature');
  }

  return true;
};
