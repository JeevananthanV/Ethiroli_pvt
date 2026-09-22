import express from 'express';
import { listClients, createClient, getClient, updateClient, deleteClient } from '../controllers/clientController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();

router.use(authenticate);

router.get('/clients', requireRole('PROJECT_MANAGER', 'ADMIN', 'FINANCE', 'SUPER_ADMIN'), listClients);
router.post('/clients', requireRole('PROJECT_MANAGER', 'ADMIN'), validateBody('createClient'), createClient);
router.get('/clients/:id', requireRole('PROJECT_MANAGER', 'ADMIN', 'FINANCE', 'SUPER_ADMIN'), getClient);
router.patch('/clients/:id', requireRole('PROJECT_MANAGER', 'ADMIN'), validateBody('createClient'), updateClient);
router.delete('/clients/:id', requireRole('ADMIN', 'SUPER_ADMIN'), deleteClient);

export default router;
