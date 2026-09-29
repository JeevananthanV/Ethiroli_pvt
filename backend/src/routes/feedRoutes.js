import express from 'express';
import { getFeed, markRead, markAllRead } from '../controllers/feedController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

import { ROLES } from '../config/constants.js';

const router = express.Router();
router.use(authenticate);

const ALL_ROLES = Object.values(ROLES);

router.get('/', requireRole(...ALL_ROLES), getFeed);
router.patch('/:id/read', requireRole(...ALL_ROLES), markRead);
router.post('/read-all', requireRole(...ALL_ROLES), markAllRead);

export default router;
