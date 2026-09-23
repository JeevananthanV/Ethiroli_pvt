import express from 'express';
import {
  listQuizzes,
  createQuiz,
  getQuiz,
  getQuizForTake,
  submitQuiz,
  getQuizResults,
  updateQuiz,
  deleteQuiz,
  publishQuiz,
  unpublishQuiz,
  attachQuestions,
  detachQuestion
} from '../controllers/quizController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

router.use(authenticate);

// List & view quizzes (Allow STUDENT)
router.get('/quizzes', requireRole('STUDENT', 'EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), listQuizzes);
router.post('/quizzes', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), createQuiz);

// Student Quiz Taking & Submitting Engine
router.get('/quizzes/:id/take', requireRole('STUDENT', 'EMPLOYEE', 'INTERN', 'TUTOR', 'ADMIN', 'SUPER_ADMIN'), getQuizForTake);
router.post('/quizzes/:id/submit', requireRole('STUDENT', 'EMPLOYEE', 'INTERN', 'TUTOR', 'ADMIN', 'SUPER_ADMIN'), submitQuiz);
router.get('/quizzes/:id/results', requireRole('STUDENT', 'EMPLOYEE', 'INTERN', 'TUTOR', 'ADMIN', 'SUPER_ADMIN'), getQuizResults);

// Full quiz metadata (includes answers for tutors/admins)
router.get('/quizzes/:id', requireRole('STUDENT', 'EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), getQuiz);
router.patch('/quizzes/:id', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), updateQuiz);
router.put('/quizzes/:id', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), updateQuiz);
router.delete('/quizzes/:id', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), deleteQuiz);

// Publish / Unpublish
router.patch('/quizzes/:id/publish', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), publishQuiz);
router.patch('/quizzes/:id/unpublish', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), unpublishQuiz);

// Question Bank associations
router.post('/quizzes/:id/questions', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), attachQuestions);
router.delete('/quizzes/:id/questions/:questionId', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), detachQuestion);

export default router;
