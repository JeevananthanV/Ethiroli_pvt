import express from 'express';
import { promoteInternToEmployee, getGovernanceSummary } from '../controllers/governanceController.js';
import { reassignTutorWorkload } from '../controllers/workloadReassignController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();
router.use(authenticate);

// Standard Admin & Super Admin governance operations
router.get('/summary', requireRole('ADMIN', 'SUPER_ADMIN'), getGovernanceSummary);
router.post('/interns/:id/promote', requireRole('ADMIN', 'SUPER_ADMIN', 'HR'), promoteInternToEmployee);
router.post('/tutors/:id/reassign-workload', requireRole('ADMIN', 'SUPER_ADMIN'), reassignTutorWorkload);

export default router;
