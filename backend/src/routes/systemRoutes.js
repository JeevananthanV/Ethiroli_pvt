import express from 'express';
import { getHealth, updateConfigs, getStats, clearCache, globalSearch } from '../controllers/systemController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();

router.get('/health', getHealth);
router.put('/configs', authenticate, requireRole('SUPER_ADMIN'), validateBody('updateSystemConfig'), updateConfigs);
router.get('/stats', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), getStats);
router.post('/cache/clear', authenticate, requireRole('SUPER_ADMIN'), clearCache);
router.get('/search', authenticate, requireRole('EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), globalSearch);

export default router;
