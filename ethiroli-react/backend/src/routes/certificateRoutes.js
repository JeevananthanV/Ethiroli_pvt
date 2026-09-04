import express from 'express';
import { listCertificates, generateCertificate } from '../controllers/certificateController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/certificates', listCertificates);
router.post('/certificates/generate', generateCertificate);

export default router;
