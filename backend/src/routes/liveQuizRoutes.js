import express from 'express';
import {
  startLiveQuizSession,
  joinLiveQuizSession,
  submitAnswer,
  getLeaderboard,
  endSession
} from '../controllers/liveQuizController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

router.post('/live-quiz/sessions', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), validateBody('createLiveQuizSession'), startLiveQuizSession);
router.post('/live-quiz/sessions/:sessionId/join', requireRole('EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), validateBody('joinLiveQuizSession'), joinLiveQuizSession);
router.post('/live-quiz/sessions/:sessionId/submit', requireRole('EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), validateBody('submitAnswer'), submitAnswer);
router.get('/live-quiz/sessions/:sessionId/leaderboard', requireRole('EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), getLeaderboard);
router.post('/live-quiz/sessions/:sessionId/end', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), endSession);

export default router;
