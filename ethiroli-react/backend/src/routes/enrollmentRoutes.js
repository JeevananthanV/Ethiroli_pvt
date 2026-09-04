import express from 'express';
import { listEnrollments, enrollStudent, getMyEnrollments, updateProgress } from '../controllers/enrollmentController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/courses/:courseId/enrollments', listEnrollments);
router.post('/courses/:courseId/enroll', enrollStudent);
router.get('/enrollments/me', getMyEnrollments);
router.patch('/enrollments/:id/progress', updateProgress);

export default router;
