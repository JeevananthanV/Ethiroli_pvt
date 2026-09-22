import express from 'express';
import { getLeadScore, getStudentChurn, listPredictions } from '../controllers/predictiveController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();
router.use(authenticate);

router.get('/predict/leads/:id/score', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), getLeadScore);
router.get('/predict/students/:id/churn', requireRole('ADMIN', 'SUPER_ADMIN'), getStudentChurn);
router.get('/predictions', requireRole('ADMIN', 'SUPER_ADMIN'), listPredictions);

export default router;
