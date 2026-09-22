import crypto from 'crypto';
import pool from '../config/database.js';
import { logger } from '../config/logger.js';
import Integration from '../models/Integration.js';

/**
 * Retrieve n8n integration configuration from database or environment
 */
export const getN8nConfig = async () => {
  try {
    const integration = await Integration.findByType('n8n');
    if (integration && integration.is_enabled && integration.config) {
      return {
        webhookUrl: integration.config.webhookUrl || process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/ethiroli',
        secret: integration.config.secret || process.env.N8N_WEBHOOK_SECRET || 'ethiroli_n8n_secret_key_2026',
        enabledEvents: integration.config.enabledEvents || ['candidate.created', 'lead.created', 'contact.submitted', 'invoice.created'],
        isEnabled: Boolean(integration.is_enabled)
      };
    }
  } catch (err) {
    logger.warn('Failed to load n8n config from database, using environment fallback', { error: err.message });
  }

  return {
    webhookUrl: process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/ethiroli',
    secret: process.env.N8N_WEBHOOK_SECRET || 'ethiroli_n8n_secret_key_2026',
    enabledEvents: ['candidate.created', 'lead.created', 'contact.submitted', 'invoice.created'],
    isEnabled: Boolean(process.env.N8N_ENABLED === 'true' || process.env.N8N_WEBHOOK_URL)
  };
};

/**
 * Generate HMAC SHA-256 signature for outgoing payloads
 */
export const generateSignature = (payload, secret) => {
  if (!secret) return '';
  const stringified = typeof payload === 'string' ? payload : JSON.stringify(payload);
  return crypto.createHmac('sha256', secret).update(stringified).digest('hex');
};

/**
 * Dispatch an event to n8n webhook workflow
 */
export const dispatchN8nEvent = async (event, data = {}) => {
  const config = await getN8nConfig();

  if (!config.isEnabled && !process.env.N8N_WEBHOOK_URL) {
    logger.debug('n8n integration is disabled or not configured, skipping event dispatch', { event });
    return { success: false, reason: 'n8n_disabled' };
  }

  if (config.enabledEvents && !config.enabledEvents.includes(event)) {
    logger.debug('Event not in n8n enabled events list, skipping', { event });
    return { success: false, reason: 'event_not_subscribed' };
  }

  const payload = {
    event,
    data,
    timestamp: new Date().toISOString(),
    source: 'ethiroli-saas'
  };

  const signature = generateSignature(payload, config.secret);

  try {
    logger.info('Dispatching event to n8n workflow', { event, webhookUrl: config.webhookUrl });
    const response = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Ethiroli-Event': event,
        'X-Ethiroli-Signature': signature
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000)
    });

    const isSuccess = response.ok;
    logger.info('n8n webhook response received', { event, status: response.status, ok: isSuccess });

    return {
      success: isSuccess,
      status: response.status,
      event
    };
  } catch (error) {
    logger.warn('n8n webhook dispatch failed (n8n may be offline or unreachable)', {
      event,
      url: config.webhookUrl,
      error: error.message
    });
    return {
      success: false,
      error: error.message,
      event
    };
  }
};

/**
 * Test connectivity with an n8n webhook URL
 */
export const testN8nConnection = async (targetUrl, secret) => {
  const url = targetUrl || (await getN8nConfig()).webhookUrl;
  const secretKey = secret || (await getN8nConfig()).secret;
  const startTime = Date.now();

  const pingPayload = {
    event: 'system.ping',
    data: {
      message: 'Ethiroli n8n connection test',
      timestamp: new Date().toISOString()
    },
    source: 'ethiroli-saas'
  };

  const signature = generateSignature(pingPayload, secretKey);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Ethiroli-Event': 'system.ping',
        'X-Ethiroli-Signature': signature
      },
      body: JSON.stringify(pingPayload),
      signal: AbortSignal.timeout(4000)
    });

    const latency = Date.now() - startTime;
    return {
      success: response.ok,
      status: response.status,
      latencyMs: latency,
      message: response.ok ? `Connection established (${latency}ms)` : `n8n returned HTTP ${response.status}`
    };
  } catch (error) {
    return {
      success: false,
      latencyMs: Date.now() - startTime,
      message: `Failed to reach n8n at ${url}: ${error.message}`
    };
  }
};
