import express from 'express';
import { listIntegrations, saveIntegration, getIntegration, updateIntegration, deleteIntegration } from '../controllers/integrationController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

router.get('/integrations', requireRole('EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), listIntegrations);
router.post('/integrations', requireRole('ADMIN', 'SUPER_ADMIN'), validateBody('createIntegration'), saveIntegration);
router.get('/integrations/:id', requireRole('EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), getIntegration);
router.patch('/integrations/:id', requireRole('ADMIN', 'SUPER_ADMIN'), validateBody('createIntegration'), updateIntegration);
router.delete('/integrations/:id', requireRole('ADMIN', 'SUPER_ADMIN'), deleteIntegration);

export default router;
