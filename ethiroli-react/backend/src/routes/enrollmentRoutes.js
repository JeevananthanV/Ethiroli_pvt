import express from 'express';
import { listEnrollments, enrollStudent, getMyEnrollments, updateProgress, unenroll } from '../controllers/enrollmentController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

router.get('/courses/:courseId/enrollments', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), listEnrollments);
router.post('/courses/:courseId/enroll', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN', 'STUDENT'), validateBody('createEnrollment'), enrollStudent);
router.get('/enrollments/me', requireRole('SUPER_ADMIN', 'ADMIN', 'HR', 'TUTOR', 'STUDENT', 'EMPLOYEE', 'INTERN'), getMyEnrollments);
router.patch('/enrollments/:id/progress', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), validateBody('updateEnrollmentProgress'), updateProgress);
router.patch('/enrollments/:id/unenroll', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN', 'STUDENT'), unenroll);

export default router;
