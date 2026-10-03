import express from 'express';
import { listInterns, createIntern, getIntern, updateIntern, deleteIntern, getInternDashboard, getInternPortalConfig, getAvailableMentors, getMyInternProfile, bulkUpdateInterns, exportInterns } from '../controllers/internController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();

router.use(authenticate);

router.get('/interns/portal-config', requireRole('INTERN', 'HR', 'ADMIN', 'SUPER_ADMIN'), getInternPortalConfig);
router.get('/interns/dashboard', requireRole('INTERN', 'HR', 'ADMIN', 'SUPER_ADMIN'), getInternDashboard);
// Declared before '/interns/:id' so "me" is not swallowed by the id pattern.
router.get('/interns/me', requireRole('INTERN', 'HR', 'ADMIN', 'SUPER_ADMIN'), getMyInternProfile);
// Interns need this to see who their mentor is. Read-only; the write routes
// below stay admin-only.
router.get('/interns/mentors', requireRole('INTERN', 'TUTOR', 'SENIOR_TUTOR', 'HR', 'ADMIN', 'SUPER_ADMIN'), getAvailableMentors);
router.get('/interns/export', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), exportInterns);
router.get('/interns', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), listInterns);
router.post('/interns', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), validateBody('createIntern'), createIntern);
router.get('/interns/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), getIntern);
router.put('/interns/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), validateBody('updateIntern'), updateIntern);
router.patch('/interns/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), validateBody('updateIntern'), updateIntern);
router.delete('/interns/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), deleteIntern);
router.patch('/interns/bulk', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), bulkUpdateInterns);

export default router;
