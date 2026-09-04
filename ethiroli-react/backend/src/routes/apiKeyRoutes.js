import express from 'express';
import { listApiKeys, createApiKey } from '../controllers/apiKeyController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/developer/api-keys', listApiKeys);
router.post('/developer/api-keys', createApiKey);

export default router;
