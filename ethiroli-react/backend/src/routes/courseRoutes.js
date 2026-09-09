import express from 'express';
import { listCourses, createCourse, getCourse, updateCourse, deleteCourse, publishCourse } from '../controllers/courseController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();

router.use(authenticate);

router.get('/courses', requireRole('EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), listCourses);
router.post('/courses', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), validateBody('createCourse'), createCourse);
router.get('/courses/:id', requireRole('EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), getCourse);
router.patch('/courses/:id', requireRole('TUTOR', 'ADMIN'), validateBody('createCourse'), updateCourse);
router.delete('/courses/:id', requireRole('ADMIN', 'SUPER_ADMIN'), deleteCourse);
router.patch('/courses/:id/publish', requireRole('TUTOR', 'ADMIN'), publishCourse);

export default router;
