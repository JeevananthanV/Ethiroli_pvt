import express from 'express';
import { listUsers, createUser, updateUser, deleteUser } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();

router.use(authenticate);

router.get('/', requireRole('ADMIN', 'SUPER_ADMIN'), listUsers);
router.post('/', requireRole('ADMIN', 'SUPER_ADMIN'), validateBody('createUser'), createUser);
router.patch('/:id', requireRole('ADMIN', 'SUPER_ADMIN'), updateUser);
router.delete('/:id', requireRole('SUPER_ADMIN'), deleteUser);

export default router;
