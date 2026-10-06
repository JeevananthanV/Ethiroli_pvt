import express from 'express';
import {
  listAssignments,
  listMyAssignments,
  createAssignment,
  getAssignment,
  updateAssignment,
  deleteAssignment,
  listSubmissions,
  submitAssignment,
  getMySubmission,
  gradeSubmission
} from '../controllers/assignmentController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();

const READ_ROLES = ['STUDENT', 'INTERN', 'EMPLOYEE', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'];
const AUTHOR_ROLES = ['TUTOR', 'ADMIN', 'SUPER_ADMIN', 'PROJECT_MANAGER'];
const LEARNER_ROLES = ['STUDENT', 'INTERN', 'EMPLOYEE'];

router.use(authenticate);

// Listing
router.get('/assignments', requireRole(...READ_ROLES), listAssignments);
// NOTE: literal segments must be registered before '/assignments/:id'
router.get('/assignments/me', requireRole(...LEARNER_ROLES), listMyAssignments);

// Authoring (tutors / admins)
router.post('/assignments', requireRole(...AUTHOR_ROLES), validateBody('createAssignment'), createAssignment);
router.get('/assignments/:id', requireRole(...READ_ROLES), getAssignment);
router.patch('/assignments/:id', requireRole(...AUTHOR_ROLES), updateAssignment);
router.put('/assignments/:id', requireRole(...AUTHOR_ROLES), updateAssignment);
router.delete('/assignments/:id', requireRole(...AUTHOR_ROLES), deleteAssignment);

// Submission lifecycle
router.post('/assignments/:id/submissions', requireRole(...LEARNER_ROLES, 'TUTOR', 'ADMIN', 'SUPER_ADMIN'), submitAssignment);
router.get('/assignments/:id/mine', requireRole(...LEARNER_ROLES), getMySubmission);

// Grading
router.get('/assignments/:id/submissions', requireRole(...AUTHOR_ROLES), listSubmissions);
router.patch('/submissions/:submissionId/grade', requireRole(...AUTHOR_ROLES), gradeSubmission);
router.put('/submissions/:submissionId/grade', requireRole(...AUTHOR_ROLES), gradeSubmission);

export default router;
