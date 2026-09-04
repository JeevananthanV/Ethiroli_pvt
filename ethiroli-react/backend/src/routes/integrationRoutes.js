import express from 'express';
import { listIntegrations, saveIntegration } from '../controllers/integrationController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/integrations', listIntegrations);
router.post('/integrations', saveIntegration);

export default router;
