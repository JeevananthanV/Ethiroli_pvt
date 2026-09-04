import express from 'express';
import { listWorkflows, createWorkflow } from '../controllers/automationController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/automation/workflows', listWorkflows);
router.post('/automation/workflows', createWorkflow);

export default router;
