import express from 'express';
import { listLogs } from '../controllers/auditController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

router.use(authenticate);

router.get('/', requireRole('ADMIN', 'SUPER_ADMIN'), listLogs);

export default router;
