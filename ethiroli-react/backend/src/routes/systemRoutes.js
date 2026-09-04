import express from 'express';
import { getHealth, updateConfigs, globalSearch } from '../controllers/systemController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

router.get('/health', getHealth);
router.put('/configs', authenticate, requireRole('SUPER_ADMIN'), updateConfigs);
router.get('/search', authenticate, globalSearch);

export default router;
