import express from 'express';
import { listLogs, exportLogs } from '../controllers/auditController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

router.use(authenticate);

router.get('/', requireRole('ADMIN', 'SUPER_ADMIN'), listLogs);
router.get('/export', requireRole('ADMIN', 'SUPER_ADMIN'), exportLogs);

export default router;
