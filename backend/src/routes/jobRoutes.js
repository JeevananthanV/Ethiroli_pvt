import express from 'express';
import { listJobs, createJob, getJob, updateJob, deleteJob, closeJob, publishJob } from '../controllers/jobController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

router.get('/jobs', requireRole('EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), listJobs);
router.post('/jobs', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), validateBody('createJob'), createJob);
router.get('/jobs/:id', requireRole('EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), getJob);
router.put('/jobs/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), validateBody('updateJob'), updateJob);
router.patch('/jobs/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), validateBody('updateJob'), updateJob);
router.delete('/jobs/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), deleteJob);
router.post('/jobs/:id/close', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), closeJob);
router.post('/jobs/:id/publish', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), publishJob);

export default router;
