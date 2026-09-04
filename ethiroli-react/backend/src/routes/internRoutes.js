import express from 'express';
import { listInterns, createIntern } from '../controllers/internController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();
router.use(authenticate);

router.get('/interns', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), listInterns);
router.post('/interns', requireRole('HR', 'ADMIN'), createIntern);

export default router;
