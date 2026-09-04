import express from 'express';
import { listTenants, createTenant } from '../controllers/tenantController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/tenants', listTenants);
router.post('/tenants', createTenant);

export default router;
