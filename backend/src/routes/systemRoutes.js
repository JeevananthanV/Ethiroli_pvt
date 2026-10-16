import express from 'express';
import { 
  getHealth, 
  updateConfigs, 
  getStats, 
  clearCache, 
  globalSearch,
  getClusterTelemetry,
  triggerClusterReload
} from '../controllers/systemController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();

import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';

router.get('/health', getHealth);
router.get('/sync-production-data', asyncHandler(async (req, res) => {
  const { seedProductionData } = await import('../../scripts/seed-production-attendance.js');
  await seedProductionData();
  return success(res, 200, { ok: true }, 'Production intern attendance and leaves synced successfully');
}));
router.put('/configs', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), validateBody('updateSystemConfig'), updateConfigs);
router.get('/stats', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), getStats);
router.post('/cache/clear', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), clearCache);
router.get('/search', authenticate, requireRole('EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), globalSearch);
router.get('/cluster/telemetry', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), getClusterTelemetry);
router.post('/cluster/reload', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), triggerClusterReload);

export default router;
