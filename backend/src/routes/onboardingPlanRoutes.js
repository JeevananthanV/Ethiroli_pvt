import express from 'express';
import {
  listOnboardingPlans,
  createOnboardingPlan
} from '../controllers/onboardingPlanController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

router.use(authenticate);

router.get('/onboarding-plans', requireRole('HR', 'ADMIN', 'SUPER_ADMIN', 'EMPLOYEE', 'INTERN'), listOnboardingPlans);
router.post('/onboarding-plans', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), createOnboardingPlan);

export default router;
