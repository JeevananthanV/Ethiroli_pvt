import express from 'express';
import { listTemplates, createTemplate, getTemplate, updateTemplate, duplicateTemplate } from '../controllers/templateController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

router.get('/communication/templates', requireRole('EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), listTemplates);
router.post('/communication/templates', requireRole('ADMIN', 'SUPER_ADMIN', 'PROJECT_MANAGER'), validateBody('createTemplate'), createTemplate);
router.get('/communication/templates/:id', requireRole('EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), getTemplate);
router.patch('/communication/templates/:id', requireRole('ADMIN', 'SUPER_ADMIN', 'PROJECT_MANAGER'), validateBody('createTemplate'), updateTemplate);
router.post('/communication/templates/:id/duplicate', requireRole('ADMIN', 'SUPER_ADMIN', 'PROJECT_MANAGER'), duplicateTemplate);

export default router;
