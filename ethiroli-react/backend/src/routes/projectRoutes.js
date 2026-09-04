import express from 'express';
import { listStudentProjects, linkRepository } from '../controllers/projectController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/student-projects/projects', listStudentProjects);
router.post('/student-projects/projects', linkRepository);

export default router;
