import express from 'express';
import { listLessons, createLesson, getLesson, updateLesson, deleteLesson } from '../controllers/lessonController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();

router.use(authenticate);

router.get('/modules/:moduleId/lessons', requireRole('EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), listLessons);
router.post('/modules/:moduleId/lessons', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), validateBody('createLesson'), createLesson);
router.get('/lessons/:id', requireRole('EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), getLesson);
router.patch('/lessons/:id', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), validateBody('updateLesson'), updateLesson);
router.delete('/lessons/:id', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), deleteLesson);

export default router;
