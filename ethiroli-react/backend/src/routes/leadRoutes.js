import express from 'express';
import { listLeads, createLead, updateLeadStatus, updateLead, deleteLead, sendFollowUp, createPublicLead } from '../controllers/leadController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole, requireLeadOwnerOrAdmin } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();

router.post('/public/contact', createPublicLead);

router.use(authenticate);


router.get('/', requireRole('SALES', 'ADMIN', 'SUPER_ADMIN'), listLeads);
router.post('/', requireRole('SALES', 'ADMIN', 'SUPER_ADMIN'), validateBody('createLead'), createLead);
router.patch('/:id/status', requireRole('SALES', 'ADMIN', 'SUPER_ADMIN'), requireLeadOwnerOrAdmin, updateLeadStatus);
router.patch('/:id', requireRole('SALES', 'ADMIN', 'SUPER_ADMIN'), requireLeadOwnerOrAdmin, updateLead);
router.delete('/:id', requireRole('ADMIN', 'SUPER_ADMIN'), deleteLead);
router.post('/:id/follow-up', requireRole('SALES', 'ADMIN', 'SUPER_ADMIN'), requireLeadOwnerOrAdmin, sendFollowUp);

export default router;
