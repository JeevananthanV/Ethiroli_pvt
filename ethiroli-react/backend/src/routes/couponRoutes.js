import express from 'express';
import { listCoupons, createCoupon } from '../controllers/couponController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/coupons', listCoupons);
router.post('/coupons', createCoupon);

export default router;
