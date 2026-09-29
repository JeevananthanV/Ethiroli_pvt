import express from 'express';
import {
  assembleCourse,
  assembleProgram,
  importModulesToCourse,
  importModulesToProgram
} from '../controllers/curriculumController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();
router.use(authenticate);

// Curriculum assembly and import endpoints
router.post('/courses/:courseId/assemble', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN', 'HR'), assembleCourse);
router.post('/programs/:programId/assemble', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN', 'HR'), assembleProgram);
router.post('/courses/:courseId/import-modules', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN', 'HR'), importModulesToCourse);
router.post('/programs/:programId/import-modules', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN', 'HR'), importModulesToProgram);

export default router;
