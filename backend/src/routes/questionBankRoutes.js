import express from 'express';
import {
  listQuestions,
  createQuestion,
  getQuestion,
  deleteQuestion,
  bulkImportQuestions
} from '../controllers/questionBankController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

router.use(authenticate);

// Question Bank management for instructors, staff and admins
router.get('/question-bank', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN', 'EMPLOYEE'), listQuestions);
router.post('/question-bank', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), createQuestion);
router.post('/question-bank/bulk-import', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), bulkImportQuestions);
router.get('/question-bank/:id', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), getQuestion);
router.delete('/question-bank/:id', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), deleteQuestion);

export default router;
