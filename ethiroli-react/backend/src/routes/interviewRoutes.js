import express from 'express';
import { listInterviews, scheduleInterview, getInterview, updateInterview, submitFeedback } from '../controllers/interviewController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

router.get('/interviews', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), listInterviews);
router.post('/interviews', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), validateBody('createInterview'), scheduleInterview);
router.get('/interviews/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), getInterview);
router.patch('/interviews/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), validateBody('createInterview'), updateInterview);
router.post('/interviews/:id/feedback', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), validateBody('createInterview'), submitFeedback);

export default router;
