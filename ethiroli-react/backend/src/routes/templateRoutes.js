import express from 'express';
import { listTemplates, createTemplate } from '../controllers/templateController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/communication/templates', listTemplates);
router.post('/communication/templates', createTemplate);

export default router;
