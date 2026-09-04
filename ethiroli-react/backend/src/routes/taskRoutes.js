import express from 'express';
import { listTasks, createTask, updateTaskStatus } from '../controllers/taskController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/tasks', listTasks);
router.post('/tasks', createTask);
router.patch('/tasks/:id/status', updateTaskStatus);

export default router;
