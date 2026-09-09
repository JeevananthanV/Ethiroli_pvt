import express from 'express';
import { listReviews, createReview, getReview, updateReview, deleteReview } from '../controllers/performanceController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

router.get('/performance/reviews', requireRole('HR', 'ADMIN', 'SUPER_ADMIN', 'EMPLOYEE'), listReviews);
router.post('/performance/reviews', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), validateBody('createPerformanceReview'), createReview);
router.get('/performance/reviews/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN', 'EMPLOYEE'), getReview);
router.patch('/performance/reviews/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), validateBody('createPerformanceReview'), updateReview);
router.delete('/performance/reviews/:id', requireRole('ADMIN', 'SUPER_ADMIN'), deleteReview);

export default router;
