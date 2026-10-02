import express from 'express';
import { listInstances, getInstance, approveInstance, rejectInstance } from '../controllers/approvalController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

// SECURITY: EMPLOYEE was removed from this router. These endpoints are
// unscoped - approvalController resolves the instance by id alone, with no
// approver / current-step / initiator check - so allowing EMPLOYEE let any
// employee approve or reject anybody's request (proved: a SUPER_ADMIN request
// flipped PENDING -> APPROVED with an employee token).
// The Employee portal does not use this router; it reads its own scoped
// endpoint GET /v1/employee/approvals, which filters `WHERE ai.initiated_by = ?`.
// HR / ADMIN / SUPER_ADMIN / PROJECT_MANAGER keep exactly the access they had.
router.get('/approvals', requireRole('ADMIN', 'SUPER_ADMIN', 'HR', 'PROJECT_MANAGER'), listInstances);
router.get('/approvals/:id', requireRole('ADMIN', 'SUPER_ADMIN', 'HR', 'PROJECT_MANAGER'), getInstance);
router.post('/approvals/:id/approve', requireRole('ADMIN', 'SUPER_ADMIN', 'HR', 'PROJECT_MANAGER'), validateBody('approveInstance'), approveInstance);
router.post('/approvals/:id/reject', requireRole('ADMIN', 'SUPER_ADMIN', 'HR', 'PROJECT_MANAGER'), validateBody('rejectInstance'), rejectInstance);

export default router;
