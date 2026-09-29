import express from 'express';
import {
  getTutorProfile,
  updateTutorProfile,
  changeTutorPassword,
  getTutorMetrics
} from '../controllers/tutorController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

router.use(authenticate);
router.use(requireRole('TUTOR', 'SENIOR_TUTOR', 'ADMIN', 'SUPER_ADMIN'));

router.get('/profile', getTutorProfile);
router.patch('/profile', updateTutorProfile);
router.put('/credentials/password', changeTutorPassword);
router.get('/metrics', getTutorMetrics);

export default router;
