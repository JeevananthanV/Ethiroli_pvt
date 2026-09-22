import express from 'express';
import { listCoupons, createCoupon, getCoupon, updateCoupon, validateCoupon } from '../controllers/couponController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

router.get('/coupons', requireRole('ADMIN', 'SUPER_ADMIN', 'PROJECT_MANAGER'), listCoupons);
router.post('/coupons', requireRole('ADMIN', 'SUPER_ADMIN', 'PROJECT_MANAGER'), validateBody('createCoupon'), createCoupon);
router.get('/coupons/:id', requireRole('ADMIN', 'SUPER_ADMIN', 'PROJECT_MANAGER'), getCoupon);
router.patch('/coupons/:id', requireRole('ADMIN', 'SUPER_ADMIN', 'PROJECT_MANAGER'), validateBody('createCoupon'), updateCoupon);
router.post('/coupons/validate', requireRole('EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), validateBody('validateCoupon'), validateCoupon);

export default router;
