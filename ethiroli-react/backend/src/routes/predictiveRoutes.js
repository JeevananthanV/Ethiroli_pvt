import express from 'express';
import { getLeadScore, getStudentChurn } from '../controllers/predictiveController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/predict/leads/:id/score', getLeadScore);
router.get('/predict/students/:id/churn', getStudentChurn);

export default router;
