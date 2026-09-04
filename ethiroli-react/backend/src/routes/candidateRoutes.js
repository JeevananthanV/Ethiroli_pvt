import express from 'express';
import { listCandidates, createCandidate } from '../controllers/candidateController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/candidates', authenticate, listCandidates);
router.post('/candidates', createCandidate);


export default router;
