import express from 'express';
import { listAssignments, createAssignment, getAssignment, updateAssignment, listSubmissions, gradeSubmission } from '../controllers/assignmentController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();

router.use(authenticate);

router.get('/assignments', requireRole('EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), listAssignments);
router.post('/assignments', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), validateBody('createAssignment'), createAssignment);
router.get('/assignments/:id', requireRole('EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), getAssignment);
router.patch('/assignments/:id', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), validateBody('createAssignment'), updateAssignment);
router.get('/assignments/:id/submissions', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), listSubmissions);
router.patch('/submissions/:submissionId/grade', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), gradeSubmission);

export default router;
