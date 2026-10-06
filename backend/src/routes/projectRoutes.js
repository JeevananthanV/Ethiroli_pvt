import express from 'express';
import {
  listStudentProjects,
  linkRepository,
  getStudentProject,
  updateStudentProject,
  deleteStudentProject,
  listAssignableUsers
} from '../controllers/projectController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

const viewRoles = requireRole('STUDENT', 'EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION');
const editRoles = requireRole('STUDENT', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN');
// Only roles that can actually own a project need the assignee directory.
const assignRoles = requireRole('TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'HR');

// /student-projects/projects endpoints
// The literal assignable-users path must be declared before the `/:id` routes,
// otherwise Express hands "assignable-users" to getStudentProject as an id.
router.get('/student-projects/projects/assignable-users', assignRoles, listAssignableUsers);
router.get('/student-projects/projects', viewRoles, listStudentProjects);
router.post('/student-projects/projects', editRoles, validateBody('createStudentProject'), linkRepository);
router.get('/student-projects/projects/:id', viewRoles, getStudentProject);
router.put('/student-projects/projects/:id', editRoles, updateStudentProject);
router.patch('/student-projects/projects/:id', editRoles, updateStudentProject);
router.delete('/student-projects/projects/:id', editRoles, deleteStudentProject);

// /projects aliases for global frontend projectApi
router.get('/projects/assignable-users', assignRoles, listAssignableUsers);
router.get('/projects', viewRoles, listStudentProjects);
router.post('/projects', editRoles, linkRepository);
router.get('/projects/:id', viewRoles, getStudentProject);
router.put('/projects/:id', editRoles, updateStudentProject);
router.patch('/projects/:id', editRoles, updateStudentProject);
router.delete('/projects/:id', editRoles, deleteStudentProject);

export default router;
