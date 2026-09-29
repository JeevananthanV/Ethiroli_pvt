import express from 'express';
import { sendMessage, sendBulkMessages, listLogs, scheduleMessage } from '../controllers/communicationController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

router.post('/communication/send', requireRole('HR', 'TUTOR', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), validateBody('createCommunication'), sendMessage);
router.post('/communication/send/bulk', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), sendBulkMessages);
router.post('/communication/schedule', requireRole('HR', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), validateBody('createCommunication'), scheduleMessage);
router.get('/communication/logs', requireRole('HR', 'TUTOR', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), listLogs);

export default router;
