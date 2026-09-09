import express from 'express';
import { listCandidates, createCandidate, getCandidate, updateCandidate, deleteCandidate } from '../controllers/candidateController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

router.get('/candidates', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), listCandidates);
router.post('/candidates', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), validateBody('createCandidate'), createCandidate);
router.get('/candidates/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), getCandidate);
router.patch('/candidates/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), validateBody('createCandidate'), updateCandidate);
router.delete('/candidates/:id', requireRole('ADMIN', 'SUPER_ADMIN'), deleteCandidate);

export default router;
