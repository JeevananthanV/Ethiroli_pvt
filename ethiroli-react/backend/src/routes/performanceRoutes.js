import express from 'express';
import { listReviews, createReview } from '../controllers/performanceController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/performance/reviews', listReviews);
router.post('/performance/reviews', createReview);

export default router;
