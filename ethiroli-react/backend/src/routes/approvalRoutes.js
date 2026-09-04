import express from 'express';
import { listPendingApprovals, initiateApproval } from '../controllers/approvalController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/approvals/pending', listPendingApprovals);
router.post('/approvals/instances', initiateApproval);

export default router;
