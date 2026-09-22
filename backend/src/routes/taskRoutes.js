import express from 'express';
import { listTasks, createTask, getTask, updateTask, updateTaskStatus, bulkUpdateTasks } from '../controllers/taskController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

router.get('/tasks', requireRole('SUPER_ADMIN', 'ADMIN', 'PROJECT_MANAGER', 'EMPLOYEE', 'INTERN'), listTasks);
router.post('/tasks', requireRole('PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN'), validateBody('createTask'), createTask);
router.get('/tasks/:id', requireRole('SUPER_ADMIN', 'ADMIN', 'PROJECT_MANAGER', 'EMPLOYEE', 'INTERN'), getTask);
router.patch('/tasks/:id', requireRole('PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN'), validateBody('createTask'), updateTask);
router.patch('/tasks/:id/status', requireRole('SUPER_ADMIN', 'ADMIN', 'PROJECT_MANAGER', 'EMPLOYEE', 'INTERN'), validateBody('updateTaskStatus'), updateTaskStatus);
router.post('/tasks/bulk/status', requireRole('PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN'), validateBody('bulkUpdateTasks'), bulkUpdateTasks);

export default router;
