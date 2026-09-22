import express from 'express';
import { listApiKeys, createApiKey, getApiKey, updateApiKey, regenerateApiKey, deleteApiKey } from '../controllers/apiKeyController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

router.get('/developer/api-keys', requireRole('ADMIN', 'SUPER_ADMIN'), listApiKeys);
router.post('/developer/api-keys', requireRole('ADMIN', 'SUPER_ADMIN'), validateBody('createApiKey'), createApiKey);
router.get('/developer/api-keys/:id', requireRole('ADMIN', 'SUPER_ADMIN'), getApiKey);
router.patch('/developer/api-keys/:id', requireRole('ADMIN', 'SUPER_ADMIN'), validateBody('createApiKey'), updateApiKey);
router.post('/developer/api-keys/:id/regenerate', requireRole('ADMIN', 'SUPER_ADMIN'), regenerateApiKey);
router.delete('/developer/api-keys/:id', requireRole('ADMIN', 'SUPER_ADMIN'), deleteApiKey);

export default router;
