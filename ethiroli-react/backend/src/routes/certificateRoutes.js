import express from 'express';
import { listCertificates, generateCertificate, getCertificate, verifyCertificate, downloadCertificate } from '../controllers/certificateController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

router.get('/certificates', requireRole('STUDENT', 'TUTOR', 'ADMIN', 'SUPER_ADMIN'), listCertificates);
router.post('/certificates/generate', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), validateBody('createCertificate'), generateCertificate);
router.get('/certificates/:id', requireRole('STUDENT', 'TUTOR', 'ADMIN', 'SUPER_ADMIN'), getCertificate);
router.get('/certificates/verify/:code', verifyCertificate);
router.get('/certificates/:id/download', requireRole('STUDENT', 'TUTOR', 'ADMIN', 'SUPER_ADMIN'), downloadCertificate);

export default router;
