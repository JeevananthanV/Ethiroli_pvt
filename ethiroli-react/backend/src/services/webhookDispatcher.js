import crypto from 'crypto';
import pool from '../config/database.js';
import { logger } from '../config/logger.js';

export const dispatch = async (event, data) => {
  logger.info('Dispatching webhook', { event });

  try {
    const [subscriptions] = await pool.execute(
      'SELECT * FROM webhook_subscriptions WHERE is_active = TRUE AND event = ?',
      [event]
    );

    if (subscriptions.length === 0) {
      logger.info('No active webhook subscriptions for event', { event });
      return { success: true, dispatched: 0, event };
    }

    let successCount = 0;

    for (const sub of subscriptions) {
      try {
        const response = await fetch(sub.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Event': event,
            'X-Webhook-Signature': generateSignature(sub.url, data, sub.secret || '')
          },
          body: JSON.stringify({ event, data, timestamp: new Date().toISOString() })
        });

        if (response.ok) {
          successCount++;
          await pool.execute(
            'UPDATE webhook_subscriptions SET last_dispatched_at = CURRENT_TIMESTAMP, last_status = ? WHERE id = ?',
            ['success', sub.id]
          );
        } else {
          await pool.execute(
            'UPDATE webhook_subscriptions SET last_dispatched_at = CURRENT_TIMESTAMP, last_status = ?, failure_count = failure_count + 1 WHERE id = ?',
            ['failed', sub.id]
          );
        }
      } catch (error) {
        logger.error('Webhook dispatch failed for subscription', { subscriptionId: sub.id, error: error.message });
        await pool.execute(
          'UPDATE webhook_subscriptions SET failure_count = failure_count + 1, last_status = ? WHERE id = ?',
          ['error', sub.id]
        );
      }
    }

    logger.info('Webhook dispatch completed', { event, successCount, total: subscriptions.length });

    return { success: true, event, dispatched: successCount, total: subscriptions.length };
  } catch (error) {
    logger.error('Webhook dispatch process failed', { event, error: error.message });
    throw error;
  }
};

const generateSignature = (url, payload, secret) => {
  if (!secret) return '';
  return crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
};

export const retryFailed = async () => {
  logger.info('Retrying failed webhooks');

  try {
    const [subscriptions] = await pool.execute(
      "SELECT * FROM webhook_subscriptions WHERE is_active = TRUE AND (last_status = 'failed' OR last_status = 'error') AND failure_count < 5"
    );

    let retryCount = 0;

    for (const sub of subscriptions) {
      try {
        const [rows] = await pool.execute(
          'SELECT * FROM webhook_subscriptions WHERE event = ? ORDER BY created_at DESC LIMIT 1',
          [sub.event]
        );

        if (rows.length > 0) {
          const payload = JSON.parse(rows[0].payload || '{}');
          await dispatch(sub.event, payload);
          retryCount++;
        }
      } catch (error) {
        logger.error('Webhook retry failed', { subscriptionId: sub.id, error: error.message });
      }
    }

    logger.info('Webhook retry completed', { retryCount });

    return { success: true, retryCount };
  } catch (error) {
    logger.error('Webhook retry process failed', { error: error.message });
    throw error;
  }
};
