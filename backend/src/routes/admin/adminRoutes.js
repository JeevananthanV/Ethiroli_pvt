import express from 'express';
import { authenticate } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/rbac.js';
import { ROLES } from '../../config/constants.js';

const router = express.Router();

router.use(authenticate);
router.use(requireRole(ROLES.ADMIN, ROLES.SUPER_ADMIN));

router.get('/dashboard', (req, res) => {
  res.json({ message: 'Admin dashboard' });
});

export default router;
