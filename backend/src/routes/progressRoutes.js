import express from 'express';
import { getCourseCurriculum, getMyProgress, getCourseProgress } from '../controllers/progressController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

const READ_ROLES = ['STUDENT', 'EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION', 'HR'];

router.use(authenticate);

// Module/lesson tree with completion state for the requesting user
router.get('/courses/:courseId/curriculum', requireRole(...READ_ROLES), getCourseCurriculum);

// Progress-only projection of a single course
router.get('/courses/:courseId/progress', requireRole(...READ_ROLES), getCourseProgress);

// Cross-course learning progress for the signed-in learner
router.get('/progress/me', requireRole('STUDENT', 'EMPLOYEE', 'INTERN', 'TUTOR', 'ADMIN', 'SUPER_ADMIN'), getMyProgress);

export default router;
