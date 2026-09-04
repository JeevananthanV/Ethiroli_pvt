import express from 'express';
import { listInterviews, scheduleInterview } from '../controllers/interviewController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/interviews', listInterviews);
router.post('/interviews', scheduleInterview);

export default router;
