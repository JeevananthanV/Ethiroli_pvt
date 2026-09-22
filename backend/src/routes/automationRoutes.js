import express from 'express';
import { listWorkflows, createWorkflow, getWorkflow, updateWorkflow, executeWorkflow } from '../controllers/automationController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

router.get('/automation/workflows', requireRole('ADMIN', 'SUPER_ADMIN'), listWorkflows);
router.post('/automation/workflows', requireRole('ADMIN', 'SUPER_ADMIN'), validateBody('createAutomationWorkflow'), createWorkflow);
router.get('/automation/workflows/:id', requireRole('ADMIN', 'SUPER_ADMIN'), getWorkflow);
router.patch('/automation/workflows/:id', requireRole('ADMIN', 'SUPER_ADMIN'), validateBody('createAutomationWorkflow'), updateWorkflow);
router.post('/automation/workflows/:id/execute', requireRole('ADMIN', 'SUPER_ADMIN'), executeWorkflow);

export default router;
