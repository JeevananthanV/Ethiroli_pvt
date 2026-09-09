import express from 'express';
import { authenticate, requireRole } from '../../middleware/auth.js';
import { ROLES } from '../../config/constants.js';

const router = express.Router();

router.use(authenticate);
router.use(requireRole(ROLES.CLIENT));

router.get('/dashboard', (req, res) => {
  res.json({ message: 'Client dashboard' });
});

export default router;
