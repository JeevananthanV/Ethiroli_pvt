import express from 'express';
import { listErrorLogs, resolveError, clearErrorLogs, getErrorLog } from '../controllers/monitoringController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

router.get('/monitoring/errors', requireRole('ADMIN', 'SUPER_ADMIN'), listErrorLogs);
router.get('/monitoring/errors/:id', requireRole('ADMIN', 'SUPER_ADMIN'), getErrorLog);
router.patch('/monitoring/errors/:id/resolve', requireRole('ADMIN', 'SUPER_ADMIN'), validateBody('resolveError'), resolveError);
router.post('/monitoring/errors/clear', requireRole('ADMIN', 'SUPER_ADMIN'), validateBody('clearErrorLogs'), clearErrorLogs);

export default router;
