import express from 'express';
import {
  listLessons,
  createLesson,
  getLesson,
  updateLesson,
  deleteLesson,
  completeLesson,
  reorderLessons,
  getLessonBlocks,
  createLessonBlock,
  deleteLessonBlock
} from '../controllers/lessonController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

router.use(authenticate);

// List lessons (Allow STUDENT)
router.get('/modules/:moduleId/lessons', requireRole('STUDENT', 'EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), listLessons);
router.get('/lessons', requireRole('STUDENT', 'EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), listLessons);

// Create lesson
router.post('/modules/:moduleId/lessons', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), createLesson);
router.post('/lessons', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), createLesson);

// Single lesson details, update, delete
router.get('/lessons/:id', requireRole('STUDENT', 'EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), getLesson);
router.patch('/lessons/:id', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), updateLesson);
router.put('/lessons/:id', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), updateLesson);
router.delete('/lessons/:id', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), deleteLesson);

// Student lesson progress completion
router.post('/lessons/:id/complete', requireRole('STUDENT', 'INTERN', 'EMPLOYEE', 'TUTOR', 'ADMIN', 'SUPER_ADMIN'), completeLesson);

// Reordering lessons in a module
router.post('/modules/:moduleId/lessons/reorder', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), reorderLessons);
router.put('/modules/:moduleId/lessons/reorder', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), reorderLessons);

// Lesson content blocks
router.get('/lessons/:id/blocks', requireRole('STUDENT', 'EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), getLessonBlocks);
router.post('/lessons/:id/blocks', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), createLessonBlock);
router.delete('/lessons/:id/blocks/:blockId', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), deleteLessonBlock);

export default router;
