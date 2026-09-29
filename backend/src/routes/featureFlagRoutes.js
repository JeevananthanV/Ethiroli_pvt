import express from 'express';
import { 
  listFeatureFlags, 
  createFeatureFlag, 
  toggleFeatureFlag, 
  emergencyKillSwitch,
  getFeatureFlag,
  updateFeatureFlag,
  deleteFeatureFlag
} from '../controllers/featureFlagController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();
router.use(authenticate);

// Super Admin & Admin feature flag controls
router.get('/', requireRole('ADMIN', 'SUPER_ADMIN'), listFeatureFlags);
router.post('/', requireRole('ADMIN', 'SUPER_ADMIN'), createFeatureFlag);
router.get('/:key', requireRole('ADMIN', 'SUPER_ADMIN'), getFeatureFlag);
router.put('/:key', requireRole('ADMIN', 'SUPER_ADMIN'), updateFeatureFlag);
router.patch('/:key', requireRole('ADMIN', 'SUPER_ADMIN'), updateFeatureFlag);
router.patch('/:key/toggle', requireRole('ADMIN', 'SUPER_ADMIN'), toggleFeatureFlag);
router.post('/:key/kill-switch', requireRole('ADMIN', 'SUPER_ADMIN'), emergencyKillSwitch);
router.delete('/:key', requireRole('ADMIN', 'SUPER_ADMIN'), deleteFeatureFlag);

export default router;
