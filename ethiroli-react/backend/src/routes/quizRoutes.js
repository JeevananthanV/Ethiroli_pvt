import express from 'express';
import { createQuiz, getQuiz } from '../controllers/quizController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.post('/quizzes', createQuiz);
router.get('/quizzes/:id', getQuiz);

export default router;
