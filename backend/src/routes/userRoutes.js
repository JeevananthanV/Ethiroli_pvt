import express from 'express';
import { listUsers, createUser, getUser, updateUser, deleteUser } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();

router.use(authenticate);

router.get('/', requireRole('ADMIN', 'SUPER_ADMIN'), listUsers);
router.post('/', requireRole('ADMIN', 'SUPER_ADMIN'), validateBody('createUser'), createUser);
router.get('/:id', requireRole('ADMIN', 'SUPER_ADMIN'), getUser);
router.patch('/:id', requireRole('ADMIN', 'SUPER_ADMIN'), validateBody('updateUser'), updateUser);
router.delete('/:id', requireRole('SUPER_ADMIN'), deleteUser);

export default router;
