import express from 'express';
import { listTasks, createTask, getTask, updateTask, updateTaskStatus, bulkUpdateTasks, deleteTask, moveTask } from '../controllers/taskController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

const readRoles = requireRole('SUPER_ADMIN', 'ADMIN', 'PROJECT_MANAGER', 'EMPLOYEE', 'INTERN');
const manageRoles = requireRole('PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN');

router.get('/tasks', readRoles, listTasks);
router.post('/tasks', manageRoles, validateBody('createTask'), createTask);
router.get('/tasks/:id', readRoles, getTask);
router.put('/tasks/:id', manageRoles, validateBody('updateTask'), updateTask);
router.patch('/tasks/:id', manageRoles, validateBody('updateTask'), updateTask);
router.patch('/tasks/:id/status', readRoles, validateBody('updateTaskStatus'), updateTaskStatus);
router.patch('/tasks/:id/move', readRoles, moveTask);
router.delete('/tasks/:id', manageRoles, deleteTask);
router.post('/tasks/bulk/status', manageRoles, validateBody('bulkUpdateTasks'), bulkUpdateTasks);

export default router;
