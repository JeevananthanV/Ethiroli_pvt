import express from 'express';
import { registerDevice, listDevices, unregisterDevice, sendCampaign, testUserPush } from '../controllers/pushNotificationController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

const ALL_ROLES = [
  'SUPER_ADMIN', 'ADMIN', 'HR', 'TUTOR', 'PROJECT_MANAGER',
  'FINANCE', 'SALES', 'RECEPTION', 'EMPLOYEE', 'STUDENT', 'INTERN'
];

router.post('/notifications/devices', requireRole(...ALL_ROLES), registerDevice);
router.get('/notifications/devices', requireRole(...ALL_ROLES), listDevices);
router.delete('/notifications/devices/:id', requireRole(...ALL_ROLES), unregisterDevice);
router.post('/notifications/test', requireRole(...ALL_ROLES), testUserPush);
router.post('/notifications/campaign', requireRole('ADMIN', 'SUPER_ADMIN'), validateBody('sendCampaign'), sendCampaign);

export default router;
