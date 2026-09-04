import express from 'express';
import { listJobs, createJob } from '../controllers/jobController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/jobs', listJobs);
router.post('/jobs', createJob);

export default router;
