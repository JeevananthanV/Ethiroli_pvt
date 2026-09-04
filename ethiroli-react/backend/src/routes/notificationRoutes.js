import express from 'express';
import { registerDevice } from '../controllers/pushNotificationController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.post('/notifications/devices', registerDevice);

export default router;
