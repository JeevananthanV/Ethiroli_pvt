import express from 'express';
import {
  listTechnologyModules,
  createTechnologyModule,
  getTechnologyModule,
  updateTechnologyModule,
  removeTechnologyModule,
  listModulesByCourse,
  listModulesByProgram
} from '../controllers/technologyController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();
router.use(authenticate);

router.get('/technology-modules', requireRole('STUDENT', 'EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION', 'HR'), listTechnologyModules);
router.post('/technology-modules', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN', 'HR'), createTechnologyModule);
router.get('/technology-modules/:id', requireRole('STUDENT', 'EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION', 'HR'), getTechnologyModule);
router.put('/technology-modules/:id', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN', 'HR'), updateTechnologyModule);
router.patch('/technology-modules/:id', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN', 'HR'), updateTechnologyModule);
router.delete('/technology-modules/:id', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN', 'HR'), removeTechnologyModule);

router.get('/courses/:courseId/technology-modules', requireRole('STUDENT', 'EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION', 'HR'), listModulesByCourse);
router.get('/programs/:programId/technology-modules', requireRole('STUDENT', 'EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION', 'HR'), listModulesByProgram);

export default router;
