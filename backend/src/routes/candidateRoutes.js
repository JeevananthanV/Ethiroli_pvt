import express from 'express';
import {
  listCandidates,
  listCareerApplications,
  createCandidate,
  getCandidate,
  updateCandidate,
  deleteCandidate,
  deleteCareerApplication,
  convertCandidateToEmployee,
  convertCandidateToIntern
} from '../controllers/candidateController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

// Public submission endpoints (supports POST / or /candidates or /apply)
router.post('/', createCandidate);
router.post('/candidates', createCandidate);
router.post('/apply', createCandidate);
router.post('/candidates/apply', createCandidate);

// Protected endpoints for HR and Admins
router.get('/', authenticate, requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), listCandidates);
router.get('/candidates', authenticate, requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), listCandidates);
router.get('/applications', authenticate, requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), listCareerApplications);
router.get('/:id', authenticate, requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), getCandidate);
router.patch('/:id', authenticate, requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), updateCandidate);
router.delete('/:id', authenticate, requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), deleteCandidate);
router.delete('/applications/:id', authenticate, requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), deleteCareerApplication);

// Candidate conversion actions
router.post('/:id/convert-employee', authenticate, requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), convertCandidateToEmployee);
router.post('/:id/convert-intern', authenticate, requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), convertCandidateToIntern);

export default router;
