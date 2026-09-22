import express from 'express';
import { listProviders, saveProvider, getProvider, updateProvider, testProviderConnection } from '../controllers/providerController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

router.get('/communication/providers', requireRole('EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), listProviders);
router.post('/communication/providers', requireRole('ADMIN', 'SUPER_ADMIN'), validateBody('createProvider'), saveProvider);
router.get('/communication/providers/:id', requireRole('EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), getProvider);
router.patch('/communication/providers/:id', requireRole('ADMIN', 'SUPER_ADMIN'), validateBody('createProvider'), updateProvider);
router.post('/communication/providers/:id/test', requireRole('ADMIN', 'SUPER_ADMIN'), testProviderConnection);

export default router;
