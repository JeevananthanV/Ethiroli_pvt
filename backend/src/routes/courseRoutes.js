import express from 'express';
import {
  listCourses,
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
  publishCourse,
  exportCourseCurriculum,
  importCourseCurriculum
} from '../controllers/courseController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

router.use(authenticate);

// Courses listing and view (Allow STUDENT)
router.get('/courses', requireRole('STUDENT', 'EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION', 'HR'), listCourses);
router.post('/courses', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN', 'HR'), createCourse);
router.get('/courses/:id', requireRole('STUDENT', 'EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION', 'HR'), getCourse);
router.patch('/courses/:id', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN', 'HR'), updateCourse);
router.delete('/courses/:id', requireRole('ADMIN', 'SUPER_ADMIN', 'HR'), deleteCourse);
router.patch('/courses/:id/publish', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN', 'HR'), publishCourse);

// Bulk Curriculum Export and Import
router.get('/courses/:id/export', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), exportCourseCurriculum);
router.post('/courses/:id/import', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), importCourseCurriculum);

export default router;
