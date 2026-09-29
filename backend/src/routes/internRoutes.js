import express from 'express';
import { listInterns, createIntern, getIntern, updateIntern, deleteIntern, getInternDashboard, getInternPortalConfig, getAvailableMentors, bulkUpdateInterns, exportInterns } from '../controllers/internController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();

router.use(authenticate);

router.get('/interns/portal-config', requireRole('INTERN', 'HR', 'ADMIN', 'SUPER_ADMIN'), getInternPortalConfig);
router.get('/interns/dashboard', requireRole('INTERN', 'HR', 'ADMIN', 'SUPER_ADMIN'), getInternDashboard);
router.get('/interns/mentors', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), getAvailableMentors);
router.get('/interns/export', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), exportInterns);
router.get('/interns', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), listInterns);
router.post('/interns', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), validateBody('createIntern'), createIntern);
router.get('/interns/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), getIntern);
router.put('/interns/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), validateBody('updateIntern'), updateIntern);
router.patch('/interns/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), validateBody('updateIntern'), updateIntern);
router.delete('/interns/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), deleteIntern);
router.patch('/interns/bulk', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), bulkUpdateInterns);

export default router;
