import express from 'express';
import { listLessons, createLesson, updateLesson, deleteLesson } from '../controllers/lessonController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/modules/:moduleId/lessons', listLessons);
router.post('/modules/:moduleId/lessons', createLesson);
router.patch('/lessons/:id', updateLesson);
router.delete('/lessons/:id', deleteLesson);

export default router;
