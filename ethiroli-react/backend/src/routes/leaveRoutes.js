import express from 'express';
import { listLeaves, applyLeave, updateLeaveStatus } from '../controllers/leaveController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();
router.use(authenticate);

router.get('/leaves', listLeaves);
router.post('/leaves', applyLeave);
router.patch('/leaves/:id/status', requireRole('HR', 'ADMIN'), updateLeaveStatus);

export default router;
