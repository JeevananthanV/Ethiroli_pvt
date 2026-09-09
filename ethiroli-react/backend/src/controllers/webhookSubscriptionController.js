import WebhookSubscription from '../models/WebhookSubscription.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listWebhooks = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [items, countRow] = await Promise.all([
    WebhookSubscription.list({ tenant_id: req.tenant?.id, limit: parseInt(limit), offset }),
    WebhookSubscription.count({ tenant_id: req.tenant?.id })
  ]);

  return success(res, 200, items, 'Webhook subscriptions retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total: countRow,
    totalPages: Math.ceil(countRow / parseInt(limit))
  });
});

export const createWebhook = asyncHandler(async (req, res) => {
  const id = await WebhookSubscription.create({ ...req.body, tenant_id: req.tenant?.id, user_id: req.user.id });
  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_WEBHOOK_SUBSCRIPTION',
    entity_type: 'WEBHOOK_SUBSCRIPTION',
    entity_id: id,
    new_value: { ...req.body, tenant_id: req.tenant?.id, user_id: req.user.id },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'webhook_subscription_created', { id });
  return success(res, 201, { id }, 'Webhook subscription created');
});

export const getWebhook = asyncHandler(async (req, res) => {
  const webhook = await WebhookSubscription.findById(req.params.id);
  if (!webhook) throw new NotFoundError('Webhook subscription not found');
  return success(res, 200, webhook, 'Webhook subscription retrieved');
});

export const updateWebhook = asyncHandler(async (req, res) => {
  const webhook = await WebhookSubscription.findById(req.params.id);
  if (!webhook) throw new NotFoundError('Webhook subscription not found');
  await WebhookSubscription.update(req.params.id, req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_WEBHOOK_SUBSCRIPTION',
    entity_type: 'WEBHOOK_SUBSCRIPTION',
    entity_id: req.params.id,
    old_value: webhook,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'webhook_subscription_updated', { id: req.params.id });
  return success(res, 200, null, 'Webhook subscription updated');
});

export const testWebhook = asyncHandler(async (req, res) => {
  await AuditLog.create({
    user_id: req.user.id,
    action: 'TEST_WEBHOOK_SUBSCRIPTION',
    entity_type: 'WEBHOOK_SUBSCRIPTION',
    entity_id: req.params.id,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'webhook_test_initiated', { id: req.params.id });
  return success(res, 200, null, 'Webhook test delivery initiated');
});
