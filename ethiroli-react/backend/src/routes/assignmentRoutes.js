import express from 'express';
import { createAssignment, getAssignment } from '../controllers/assignmentController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.post('/assignments', createAssignment);
router.get('/assignments/:id', getAssignment);

export default router;
