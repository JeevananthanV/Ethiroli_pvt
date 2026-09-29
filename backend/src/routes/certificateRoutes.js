import express from 'express';
import { listCertificates, generateCertificate, getCertificate, verifyCertificate, downloadCertificate } from '../controllers/certificateController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();

// Public: certificate verification links are shared outside the app, so this
// route must be reachable without a session (returns a sanitized payload).
router.get('/certificates/verify/:code', verifyCertificate);

router.use(authenticate);

router.get('/certificates', requireRole('STUDENT', 'INTERN', 'EMPLOYEE', 'TUTOR', 'ADMIN', 'SUPER_ADMIN'), listCertificates);
router.post('/certificates/generate', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), validateBody('createCertificate'), generateCertificate);
router.get('/certificates/:id', requireRole('STUDENT', 'INTERN', 'EMPLOYEE', 'TUTOR', 'ADMIN', 'SUPER_ADMIN'), getCertificate);
router.get('/certificates/:id/download', requireRole('STUDENT', 'INTERN', 'EMPLOYEE', 'TUTOR', 'ADMIN', 'SUPER_ADMIN'), downloadCertificate);

export default router;
