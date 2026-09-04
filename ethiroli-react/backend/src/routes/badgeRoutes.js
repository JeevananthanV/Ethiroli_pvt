import express from 'express';
import { listBadges, createBadge, getEarnedBadges } from '../controllers/badgeController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/badges', listBadges);
router.post('/badges', createBadge);
router.get('/user-badges', getEarnedBadges);
router.get('/user-badges/:userId', getEarnedBadges);

export default router;
