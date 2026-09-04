import express from 'express';
import { listErrorLogs, resolveError } from '../controllers/monitoringController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/monitoring/errors', listErrorLogs);
router.patch('/monitoring/errors/:id/resolve', resolveError);

export default router;
