import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { ROLES } from '../config/constants.js';
import * as controller from '../controllers/lmsController.js';

const router = express.Router();
router.use(authenticate);

// 1. Unified LMS Overview (role-aware: learner view vs tutor/admin view)
router.get(
  '/overview',
  requireRole(ROLES.STUDENT, ROLES.INTERN, ROLES.TUTOR, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  controller.getLMSOverview
);

// 2. Academic Batches & Attendance
router.get(
  '/batches',
  requireRole(ROLES.STUDENT, ROLES.INTERN, ROLES.TUTOR, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  controller.getBatches
);
router.post(
  '/batches',
  requireRole(ROLES.TUTOR, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  controller.createBatch
);
router.get(
  '/batches/:id/students',
  requireRole(ROLES.TUTOR, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  controller.getBatchStudents
);
router.post(
  '/batches/:id/students',
  requireRole(ROLES.TUTOR, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  controller.addStudentToBatch
);
router.get(
  '/batches/:id/attendance',
  requireRole(ROLES.TUTOR, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  controller.getBatchAttendance
);
router.post(
  '/batches/:id/attendance',
  requireRole(ROLES.TUTOR, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  controller.markBatchAttendance
);

// 3. Doubt Management
router.get(
  '/doubts',
  requireRole(ROLES.STUDENT, ROLES.INTERN, ROLES.TUTOR, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  controller.getDoubts
);
router.post(
  '/doubts',
  requireRole(ROLES.STUDENT, ROLES.INTERN, ROLES.TUTOR, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  controller.submitDoubt
);
router.patch(
  '/doubts/:id/resolve',
  requireRole(ROLES.TUTOR, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  controller.resolveDoubt
);

// 4. Student Analytics & Performance
router.get(
  '/analytics',
  requireRole(ROLES.STUDENT, ROLES.INTERN, ROLES.TUTOR, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  controller.getStudentAnalytics
);

export default router;
