import express from 'express';
import {
  listHRRequests,
  createHRRequest,
  updateHRRequestStatus
} from '../controllers/hrRequestController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

router.use(authenticate);

router.get('/hr-requests', requireRole('HR', 'ADMIN', 'SUPER_ADMIN', 'EMPLOYEE', 'INTERN'), listHRRequests);
router.post('/hr-requests', requireRole('HR', 'ADMIN', 'SUPER_ADMIN', 'EMPLOYEE', 'INTERN'), createHRRequest);
router.patch('/hr-requests/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), updateHRRequestStatus);

export default router;
