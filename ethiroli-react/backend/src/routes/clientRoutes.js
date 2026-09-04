import express from 'express';
import { listClients, createClient, updateClient } from '../controllers/clientController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();
router.use(authenticate);

router.get('/clients', requireRole('PROJECT_MANAGER', 'ADMIN', 'FINANCE', 'SUPER_ADMIN'), listClients);
router.post('/clients', requireRole('PROJECT_MANAGER', 'ADMIN'), createClient);
router.patch('/clients/:id', requireRole('PROJECT_MANAGER', 'ADMIN'), updateClient);

export default router;
