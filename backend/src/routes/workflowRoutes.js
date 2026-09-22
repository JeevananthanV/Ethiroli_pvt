import express from 'express';
import { listWorkflows, createWorkflow, getWorkflow, updateWorkflow, deleteWorkflow, listChainSteps, createChainStep, updateChainStep, deleteChainStep } from '../controllers/workflowController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

router.get('/workflows', requireRole('ADMIN', 'SUPER_ADMIN'), listWorkflows);
router.post('/workflows', requireRole('ADMIN', 'SUPER_ADMIN'), validateBody('createWorkflow'), createWorkflow);
router.get('/workflows/:id', requireRole('ADMIN', 'SUPER_ADMIN'), getWorkflow);
router.patch('/workflows/:id', requireRole('ADMIN', 'SUPER_ADMIN'), validateBody('createWorkflow'), updateWorkflow);
router.delete('/workflows/:id', requireRole('SUPER_ADMIN'), deleteWorkflow);

router.get('/workflows/:workflowId/steps', requireRole('ADMIN', 'SUPER_ADMIN'), listChainSteps);
router.post('/workflows/:workflowId/steps', requireRole('ADMIN', 'SUPER_ADMIN'), validateBody('createChainStep'), createChainStep);
router.patch('/workflows/:workflowId/steps/:id', requireRole('ADMIN', 'SUPER_ADMIN'), validateBody('createChainStep'), updateChainStep);
router.delete('/workflows/:workflowId/steps/:id', requireRole('SUPER_ADMIN'), deleteChainStep);

export default router;
