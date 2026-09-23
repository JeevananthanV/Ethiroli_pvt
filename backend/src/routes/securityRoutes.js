import express from 'express';
import { 
  listThreats, 
  revokeAllSessions, 
  lockUserAccount, 
  blockIpAddress,
  initiateBreakGlass,
  approveBreakGlass,
  getBreakGlassStatus 
} from '../controllers/securityController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();
router.use(authenticate);

// Super Admin & Admin security operations
router.get('/threats', requireRole('ADMIN', 'SUPER_ADMIN'), listThreats);
router.post('/sessions/revoke-all', requireRole('ADMIN', 'SUPER_ADMIN'), revokeAllSessions);
router.patch('/users/:id/lock', requireRole('ADMIN', 'SUPER_ADMIN'), lockUserAccount);
router.post('/threats/block-ip', requireRole('ADMIN', 'SUPER_ADMIN'), blockIpAddress);

// Break-Glass Emergency Procedures (Root / Super Admin Scope)
router.post('/break-glass/initiate', requireRole('SUPER_ADMIN'), initiateBreakGlass);
router.post('/break-glass/approve', requireRole('SUPER_ADMIN'), approveBreakGlass);
router.get('/break-glass/status', requireRole('ADMIN', 'SUPER_ADMIN'), getBreakGlassStatus);

export default router;
