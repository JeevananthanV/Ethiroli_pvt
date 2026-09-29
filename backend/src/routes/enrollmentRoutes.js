import express from 'express';
import {
  listAllEnrollments,
  listEnrollments,
  enrollStudent,
  assignCourses,
  getStudentCourses,
  getTutorAssignedCourses,
  getMyEnrollments,
  updateProgress,
  unenroll
} from '../controllers/enrollmentController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

// Staff-wide enrollment listing (tutors / admins / HR)
router.get('/enrollments', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN', 'HR'), listAllEnrollments);

// Tutor / Admin course assignment (Many-to-many: assign one or multiple courses to a student)
router.post('/enrollments/assign', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), validateBody('assignCourses'), assignCourses);

// Query courses assigned by the authenticated tutor
router.get('/enrollments/tutor/assigned', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), getTutorAssignedCourses);

// Query student's customized list of enrolled courses (Student themselves, or Tutor/Admin)
router.get('/enrollments/student/:studentId', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN', 'STUDENT'), getStudentCourses);
router.get('/students/:studentId/courses', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN', 'STUDENT'), getStudentCourses);

// Single course enrollment
router.post('/courses/:courseId/enroll', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN', 'STUDENT'), validateBody('createEnrollment'), enrollStudent);
router.get('/courses/:courseId/enrollments', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), listEnrollments);

// Student self-service
router.get('/enrollments/me', requireRole('SUPER_ADMIN', 'ADMIN', 'HR', 'TUTOR', 'STUDENT', 'EMPLOYEE', 'INTERN'), getMyEnrollments);
router.patch('/enrollments/:id/progress', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), validateBody('updateEnrollmentProgress'), updateProgress);
router.put('/enrollments/:id/progress', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), validateBody('updateEnrollmentProgress'), updateProgress);
router.patch('/enrollments/:id/unenroll', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN', 'STUDENT'), unenroll);

export default router;
