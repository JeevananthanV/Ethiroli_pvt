import express from 'express';
import { listTenants, createTenant, getTenant, updateTenant } from '../controllers/tenantController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

router.get('/tenants', requireRole('SUPER_ADMIN'), listTenants);
router.post('/tenants', requireRole('SUPER_ADMIN'), validateBody('createTenant'), createTenant);
router.get('/tenants/:id', requireRole('SUPER_ADMIN'), getTenant);
router.patch('/tenants/:id', requireRole('SUPER_ADMIN'), validateBody('createTenant'), updateTenant);

export default router;
