import express from 'express';
import { listModules, createModule, updateModule, deleteModule } from '../controllers/moduleController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/courses/:courseId/modules', listModules);
router.post('/courses/:courseId/modules', createModule);
router.patch('/modules/:id', updateModule);
router.delete('/modules/:id', deleteModule);

export default router;
