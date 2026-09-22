import express from 'express';
import { listInstances, getInstance, approveInstance, rejectInstance } from '../controllers/approvalController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

router.get('/approvals', requireRole('EMPLOYEE', 'ADMIN', 'SUPER_ADMIN', 'HR', 'PROJECT_MANAGER'), listInstances);
router.get('/approvals/:id', requireRole('EMPLOYEE', 'ADMIN', 'SUPER_ADMIN', 'HR', 'PROJECT_MANAGER'), getInstance);
router.post('/approvals/:id/approve', requireRole('EMPLOYEE', 'ADMIN', 'SUPER_ADMIN', 'HR', 'PROJECT_MANAGER'), validateBody('approveInstance'), approveInstance);
router.post('/approvals/:id/reject', requireRole('EMPLOYEE', 'ADMIN', 'SUPER_ADMIN', 'HR', 'PROJECT_MANAGER'), validateBody('rejectInstance'), rejectInstance);

export default router;
