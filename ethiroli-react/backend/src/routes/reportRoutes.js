import express from 'express';
import { executeReport, listReportDefinitions, createReportDefinition } from '../controllers/reportController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.post('/reports/execute', executeReport);
router.get('/reports/definitions', listReportDefinitions);
router.post('/reports/definitions', createReportDefinition);

export default router;
