import express from 'express';
import { listModules, createModule, getModule, updateModule, deleteModule, reorderModules } from '../controllers/moduleController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();

router.use(authenticate);

router.get('/courses/:courseId/modules', requireRole('EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), listModules);
router.post('/courses/:courseId/modules', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), validateBody('createModule'), createModule);
router.get('/modules/:id', requireRole('EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), getModule);
router.patch('/modules/:id', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), validateBody('createModule'), updateModule);
router.delete('/modules/:id', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), deleteModule);
router.post('/courses/:courseId/modules/reorder', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), validateBody('reorderModules'), reorderModules);

export default router;
