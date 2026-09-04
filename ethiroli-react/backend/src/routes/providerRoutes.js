import express from 'express';
import { listProviders, saveProvider } from '../controllers/providerController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/communication/providers', listProviders);
router.post('/communication/providers', saveProvider);

export default router;
