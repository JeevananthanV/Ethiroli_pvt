import express from 'express';
import { getFeed, markRead } from '../controllers/feedController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getFeed);
router.patch('/:id/read', markRead);

export default router;
