import express from 'express';
import { startLiveQuizSession, joinLiveQuizSession, submitAnswer, getLeaderboard } from '../controllers/liveQuizController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.post('/live-quiz/sessions', startLiveQuizSession);
router.post('/live-quiz/sessions/:sessionId/join', joinLiveQuizSession);
router.post('/live-quiz/sessions/:sessionId/submit', submitAnswer);
router.get('/live-quiz/sessions/:sessionId/leaderboard', getLeaderboard);

export default router;
