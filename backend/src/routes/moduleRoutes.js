import express from 'express';
import { listModules, createModule, getModule, updateModule, deleteModule, reorderModules } from '../controllers/moduleController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

router.use(authenticate);

// List modules by course or global filter (Allow STUDENT)
router.get('/courses/:courseId/modules', requireRole('STUDENT', 'EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), listModules);
router.get('/modules', requireRole('STUDENT', 'EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), listModules);

// Create module
router.post('/courses/:courseId/modules', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), createModule);
router.post('/modules', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), createModule);

// Module details, updates, deletes
router.get('/modules/:id', requireRole('STUDENT', 'EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), getModule);
router.patch('/modules/:id', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), updateModule);
router.put('/modules/:id', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), updateModule);
router.delete('/modules/:id', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), deleteModule);

// Reorder modules
router.post('/courses/:courseId/modules/reorder', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), reorderModules);
router.put('/courses/:courseId/modules/reorder', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), reorderModules);
router.post('/modules/reorder', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), reorderModules);

export default router;
