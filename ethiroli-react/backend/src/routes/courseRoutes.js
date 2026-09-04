import express from 'express';
import { listCourses, createCourse, getCourse, updateCourse, deleteCourse } from '../controllers/courseController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();
router.use(authenticate);

router.get('/courses', listCourses);
router.post('/courses', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), createCourse);
router.get('/courses/:id', getCourse);
router.patch('/courses/:id', requireRole('TUTOR', 'ADMIN'), updateCourse);
router.delete('/courses/:id', requireRole('ADMIN', 'SUPER_ADMIN'), deleteCourse);

export default router;
