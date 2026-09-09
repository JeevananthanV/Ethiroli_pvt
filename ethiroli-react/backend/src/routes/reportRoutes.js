import express from 'express';
import { executeReport, listReportDefinitions, createReportDefinition, getReportDefinition, exportReport } from '../controllers/reportController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

router.post('/reports/execute', requireRole('ADMIN', 'SUPER_ADMIN'), executeReport);
router.get('/reports/definitions', requireRole('ADMIN', 'SUPER_ADMIN'), listReportDefinitions);
router.post('/reports/definitions', requireRole('ADMIN', 'SUPER_ADMIN'), validateBody('createReportDefinition'), createReportDefinition);
router.get('/reports/definitions/:id', requireRole('ADMIN', 'SUPER_ADMIN'), getReportDefinition);
router.get('/reports/definitions/:id/export', requireRole('ADMIN', 'SUPER_ADMIN'), exportReport);

export default router;
