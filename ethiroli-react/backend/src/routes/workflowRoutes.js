import express from 'express';
import { listWorkflows, createWorkflow } from '../controllers/workflowController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/approvals/workflows', listWorkflows);
router.post('/approvals/workflows', createWorkflow);

export default router;
