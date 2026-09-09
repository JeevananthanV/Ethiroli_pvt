import express from 'express';
import { registerDevice, listDevices, unregisterDevice, sendCampaign } from '../controllers/pushNotificationController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

router.post('/notifications/devices', requireRole('EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), registerDevice);
router.get('/notifications/devices', requireRole('EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), listDevices);
router.delete('/notifications/devices/:id', requireRole('EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), unregisterDevice);
router.post('/notifications/campaign', requireRole('ADMIN', 'SUPER_ADMIN'), validateBody('sendCampaign'), sendCampaign);

export default router;
