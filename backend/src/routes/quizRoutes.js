import express from 'express';
import { listQuizzes, createQuiz, getQuiz, updateQuiz, publishQuiz, unpublishQuiz } from '../controllers/quizController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();

router.use(authenticate);

router.get('/quizzes', requireRole('EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), listQuizzes);
router.post('/quizzes', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), validateBody('createQuiz'), createQuiz);
router.get('/quizzes/:id', requireRole('EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), getQuiz);
router.patch('/quizzes/:id', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), validateBody('updateQuiz'), updateQuiz);
router.patch('/quizzes/:id/publish', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), publishQuiz);
router.patch('/quizzes/:id/unpublish', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), unpublishQuiz);

export default router;
