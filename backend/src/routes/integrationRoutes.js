import express from 'express';
import {
  listIntegrations,
  saveIntegration,
  getIntegration,
  updateIntegration,
  deleteIntegration,
  testIntegrationConnection,
  getBrevoQuotaHandler,
  testBrevoEmailHandler,
  testN8nHandler
} from '../controllers/integrationController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

// Specific service actions (supports both /brevo/... and /integrations/brevo/...)
router.get('/brevo/quota', requireRole('ADMIN', 'SUPER_ADMIN'), getBrevoQuotaHandler);
router.get('/integrations/brevo/quota', requireRole('ADMIN', 'SUPER_ADMIN'), getBrevoQuotaHandler);

router.post('/brevo/test', requireRole('ADMIN', 'SUPER_ADMIN'), testBrevoEmailHandler);
router.post('/integrations/brevo/test', requireRole('ADMIN', 'SUPER_ADMIN'), testBrevoEmailHandler);

router.post('/n8n/test', requireRole('ADMIN', 'SUPER_ADMIN'), testN8nHandler);
router.post('/integrations/n8n/test', requireRole('ADMIN', 'SUPER_ADMIN'), testN8nHandler);

// CRUD Integrations
const rolesCanView = ['EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION', 'HR'];

router.get('/', requireRole(...rolesCanView), listIntegrations);
router.get('/integrations', requireRole(...rolesCanView), listIntegrations);

router.post('/', requireRole('ADMIN', 'SUPER_ADMIN'), validateBody('createIntegration'), saveIntegration);
router.post('/integrations', requireRole('ADMIN', 'SUPER_ADMIN'), validateBody('createIntegration'), saveIntegration);

router.get('/:id', requireRole(...rolesCanView), getIntegration);
router.get('/integrations/:id', requireRole(...rolesCanView), getIntegration);

router.patch('/:id', requireRole('ADMIN', 'SUPER_ADMIN'), validateBody('createIntegration'), updateIntegration);
router.patch('/integrations/:id', requireRole('ADMIN', 'SUPER_ADMIN'), validateBody('createIntegration'), updateIntegration);

router.delete('/:id', requireRole('ADMIN', 'SUPER_ADMIN'), deleteIntegration);
router.delete('/integrations/:id', requireRole('ADMIN', 'SUPER_ADMIN'), deleteIntegration);

// Test Connection
router.post('/:id/test', requireRole('ADMIN', 'SUPER_ADMIN'), testIntegrationConnection);
router.post('/integrations/:id/test', requireRole('ADMIN', 'SUPER_ADMIN'), testIntegrationConnection);

export default router;
