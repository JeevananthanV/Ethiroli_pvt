import express from 'express';
import {
  listOnboardingPlans,
  createOnboardingPlan,
  listOnboardings,
  createOnboarding,
  updateOnboarding,
  listTrainings,
  createTraining,
  updateTraining
} from '../controllers/onboardingPlanController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

router.use(authenticate);

router.get('/onboarding-plans', requireRole('HR', 'ADMIN', 'SUPER_ADMIN', 'EMPLOYEE', 'INTERN'), listOnboardingPlans);
router.post('/onboarding-plans', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), createOnboardingPlan);

router.get('/onboardings', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), listOnboardings);
router.post('/onboardings', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), createOnboarding);
router.patch('/onboardings/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), updateOnboarding);

router.get('/trainings', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), listTrainings);
router.post('/trainings', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), createTraining);
router.patch('/trainings/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), updateTraining);

export default router;
