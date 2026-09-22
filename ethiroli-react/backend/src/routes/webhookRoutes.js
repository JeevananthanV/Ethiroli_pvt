import express from 'express';
import {
  listWebhooks,
  createWebhook,
  getWebhook,
  updateWebhook,
  deleteWebhook,
  testWebhook,
  handleIndeedApplyWebhook
} from '../controllers/webhookSubscriptionController.js';
import { handleN8nAction } from '../controllers/n8nController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();

// 1. Inbound Public Webhook Endpoints
// Indeed Apply Candidate Ingestion (matches both /indeed/apply and /webhooks/indeed/apply)
router.post('/indeed/apply', handleIndeedApplyWebhook);
router.post('/webhooks/indeed/apply', handleIndeedApplyWebhook);

// n8n Inbound Action Callback (Authenticated via X-N8N-Webhook-Secret)
router.post('/n8n/action', handleN8nAction);
router.post('/webhooks/n8n/action', handleN8nAction);

// 2. Protected Outbound Webhook Subscription Management
const adminOnly = [authenticate, requireRole('ADMIN', 'SUPER_ADMIN')];

router.get('/', ...adminOnly, listWebhooks);
router.get('/webhooks', ...adminOnly, listWebhooks);
router.get('/developer/webhooks', ...adminOnly, listWebhooks);

router.post('/', ...adminOnly, validateBody('createWebhook'), createWebhook);
router.post('/webhooks', ...adminOnly, validateBody('createWebhook'), createWebhook);
router.post('/developer/webhooks', ...adminOnly, validateBody('createWebhook'), createWebhook);

router.get('/:id', ...adminOnly, getWebhook);
router.get('/webhooks/:id', ...adminOnly, getWebhook);
router.get('/developer/webhooks/:id', ...adminOnly, getWebhook);

router.put('/:id', ...adminOnly, updateWebhook);
router.patch('/:id', ...adminOnly, validateBody('createWebhook'), updateWebhook);
router.put('/webhooks/:id', ...adminOnly, updateWebhook);
router.patch('/webhooks/:id', ...adminOnly, updateWebhook);
router.patch('/developer/webhooks/:id', ...adminOnly, validateBody('createWebhook'), updateWebhook);

router.delete('/:id', ...adminOnly, deleteWebhook);
router.delete('/webhooks/:id', ...adminOnly, deleteWebhook);
router.delete('/developer/webhooks/:id', ...adminOnly, deleteWebhook);

router.post('/:id/test', ...adminOnly, testWebhook);
router.post('/webhooks/:id/test', ...adminOnly, testWebhook);
router.post('/developer/webhooks/:id/test', ...adminOnly, testWebhook);

export default router;
