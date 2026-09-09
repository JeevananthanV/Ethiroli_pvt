import express from 'express';
import { listStudentProjects, linkRepository, getStudentProject, updateStudentProject } from '../controllers/projectController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

router.get('/student-projects/projects', requireRole('EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), listStudentProjects);
router.post('/student-projects/projects', requireRole('TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN'), validateBody('createStudentProject'), linkRepository);
router.get('/student-projects/projects/:id', requireRole('EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), getStudentProject);
router.patch('/student-projects/projects/:id', requireRole('TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN'), validateBody('createStudentProject'), updateStudentProject);

export default router;
