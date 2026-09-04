import express from 'express';
import { sendMessage, sendBulkMessages, listLogs } from '../controllers/communicationController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.post('/communication/send', sendMessage);
router.post('/communication/send/bulk', sendBulkMessages);
router.get('/communication/logs', listLogs);

export default router;
