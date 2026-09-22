import express from 'express';
import {
  listExitRequests,
  createExitRequest,
  getExitRequest,
  updateExitRequest,
  updateChecklistTask
} from '../controllers/exitController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();
router.use(authenticate);

router.get('/exit-requests', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), listExitRequests);
router.post('/exit-requests', requireRole('HR', 'ADMIN', 'SUPER_ADMIN', 'EMPLOYEE'), createExitRequest);
router.get('/exit-requests/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN', 'EMPLOYEE'), getExitRequest);
router.patch('/exit-requests/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), updateExitRequest);
router.patch('/exit-requests/tasks/:taskId', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), updateChecklistTask);

export default router;
