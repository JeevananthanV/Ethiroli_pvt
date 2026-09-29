import express from 'express';
import { listBadges, createBadge, getBadge, updateBadge, deleteBadge, getEarnedBadges, awardBadge, revokeBadge } from '../controllers/badgeController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

// Badge Definitions CRUD
router.get('/badges', requireRole('EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), listBadges);
router.post('/badges', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), validateBody('createBadge'), createBadge);
router.get('/badges/:id', requireRole('EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), getBadge);
router.put('/badges/:id', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), validateBody('updateBadge'), updateBadge);
router.patch('/badges/:id', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), validateBody('updateBadge'), updateBadge);
router.delete('/badges/:id', requireRole('ADMIN', 'SUPER_ADMIN'), deleteBadge);

// Frontend convenience aliases for user badges
router.get('/badges/user/:userId', requireRole('EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), getEarnedBadges);
router.post('/badges/award', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), awardBadge);

// User-badges resource routes
router.get('/user-badges', requireRole('EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), getEarnedBadges);
router.get('/user-badges/:userId', requireRole('EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), getEarnedBadges);
router.post('/user-badges/award', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), validateBody('awardBadge'), awardBadge);
router.delete('/user-badges/:id', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), revokeBadge);

export default router;

