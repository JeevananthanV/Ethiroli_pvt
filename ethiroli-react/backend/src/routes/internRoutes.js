import express from 'express';
import { listInterns, createIntern, getIntern, updateIntern, deleteIntern } from '../controllers/internController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();

router.use(authenticate);

router.get('/interns', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), listInterns);
router.post('/interns', requireRole('HR', 'ADMIN'), validateBody('createIntern'), createIntern);
router.get('/interns/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), getIntern);
router.patch('/interns/:id', requireRole('HR', 'ADMIN'), validateBody('createIntern'), updateIntern);
router.delete('/interns/:id', requireRole('ADMIN', 'SUPER_ADMIN'), deleteIntern);

export default router;
