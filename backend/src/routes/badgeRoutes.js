import express from 'express';
import { listBadges, createBadge, getBadge, updateBadge, getEarnedBadges, awardBadge, revokeBadge } from '../controllers/badgeController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

router.get('/badges', requireRole('EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), listBadges);
router.post('/badges', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), validateBody('createBadge'), createBadge);
router.get('/badges/:id', requireRole('EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), getBadge);
router.patch('/badges/:id', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), validateBody('createBadge'), updateBadge);
router.get('/user-badges', requireRole('EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), getEarnedBadges);
router.get('/user-badges/:userId', requireRole('EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), getEarnedBadges);
router.post('/user-badges/award', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), validateBody('awardBadge'), awardBadge);
router.delete('/user-badges/:id', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), revokeBadge);

export default router;
