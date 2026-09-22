import Integration from '../models/Integration.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success, error } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';
import { getDailyQuotaStatus, sendBrevoTestEmail } from '../services/brevoService.js';
import { testN8nConnection } from '../services/n8nService.js';
import { isFcmConfigured, testPushNotification } from '../services/fcmService.js';
import pool from '../config/database.js';

export const listIntegrations = asyncHandler(async (req, res) => {
  const list = await Integration.list();
  return success(res, 200, list, 'Integrations retrieved');
});

export const saveIntegration = asyncHandler(async (req, res) => {
  const id = await Integration.create(req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_INTEGRATION',
    entity_type: 'INTEGRATION',
    entity_id: id,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'integration_created', { id });
  return success(res, 200, { id }, 'Integration settings saved');
});

export const getIntegration = asyncHandler(async (req, res) => {
  const integration = await Integration.findById(req.params.id);
  if (!integration) throw new NotFoundError('Integration not found');
  return success(res, 200, integration, 'Integration retrieved');
});

export const updateIntegration = asyncHandler(async (req, res) => {
  const integration = await Integration.findById(req.params.id);
  if (!integration) throw new NotFoundError('Integration not found');
  await Integration.update(req.params.id, req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_INTEGRATION',
    entity_type: 'INTEGRATION',
    entity_id: req.params.id,
    old_value: integration,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'integration_updated', { id: req.params.id });
  return success(res, 200, null, 'Integration updated successfully');
});

export const deleteIntegration = asyncHandler(async (req, res) => {
  const integration = await Integration.findById(req.params.id);
  if (!integration) throw new NotFoundError('Integration not found');
  await Integration.delete(req.params.id);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'DELETE_INTEGRATION',
    entity_type: 'INTEGRATION',
    entity_id: req.params.id,
    old_value: integration,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'integration_deleted', { id: req.params.id });
  return success(res, 200, null, 'Integration deleted successfully');
});

/**
 * Test integration connection by ID
 */
export const testIntegrationConnection = asyncHandler(async (req, res) => {
  const integration = await Integration.findById(req.params.id);
  if (!integration) throw new NotFoundError('Integration not found');

  const sName = (integration.service_name || '').toLowerCase();
  let result = { status: 'connected', message: 'Service operational' };

  if (sName.includes('n8n')) {
    const n8nRes = await testN8nConnection(integration.config?.webhookUrl, integration.config?.secret);
    result = {
      status: n8nRes.success ? 'connected' : 'error',
      message: n8nRes.message,
      latencyMs: n8nRes.latencyMs
    };
  } else if (sName.includes('brevo') || sName.includes('email')) {
    const quota = await getDailyQuotaStatus();
    result = {
      status: 'connected',
      message: `Brevo active. Today's usage: ${quota.sent} / ${quota.limit} sent (${quota.remaining} remaining)`,
      quota
    };
  } else if (sName.includes('firebase') || sName.includes('fcm')) {
    const isConfig = isFcmConfigured();
    result = {
      status: 'connected',
      message: isConfig ? 'FCM credentials configured' : 'FCM running in simulated web push mode'
    };
  } else if (sName.includes('indeed')) {
    const [jobs] = await pool.execute("SELECT COUNT(*) as count FROM jobs WHERE status = 'OPEN'");
    result = {
      status: 'connected',
      message: `Indeed XML Feed active with ${jobs[0].count} open positions.`
    };
  }

  await Integration.update(req.params.id, {
    connection_status: result.status === 'connected' ? 'CONNECTED' : 'ERROR',
    last_synced_at: new Date()
  });

  return success(res, 200, result, result.message);
});

/**
 * Get Brevo daily 300 quota status
 */
export const getBrevoQuotaHandler = asyncHandler(async (req, res) => {
  const quota = await getDailyQuotaStatus();
  return success(res, 200, quota, 'Brevo daily quota status');
});

/**
 * Send test email via Brevo
 */
export const testBrevoEmailHandler = asyncHandler(async (req, res) => {
  const targetEmail = req.body.email || req.user.email;
  const result = await sendBrevoTestEmail(targetEmail);
  return success(res, 200, result, `Test email dispatched to ${targetEmail}`);
});

/**
 * Test n8n webhook connection
 */
export const testN8nHandler = asyncHandler(async (req, res) => {
  const { url, secret } = req.body;
  const result = await testN8nConnection(url, secret);
  return success(res, 200, result, result.message);
});
