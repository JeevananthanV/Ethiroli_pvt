import express from 'express';
import { listLeads, createLead, createPublicLead, updateLeadStatus, updateLead, deleteLead, sendFollowUp } from '../controllers/leadController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole, requireLeadOwnerOrAdmin } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();

router.post('/public/contact', validateBody('createLead'), createPublicLead);

router.use(authenticate);

router.get('/', requireRole('SALES', 'ADMIN', 'SUPER_ADMIN'), listLeads);
router.post('/', requireRole('SALES', 'ADMIN', 'SUPER_ADMIN'), validateBody('createLead'), createLead);
router.patch('/:id/status', requireRole('SALES', 'ADMIN', 'SUPER_ADMIN'), requireLeadOwnerOrAdmin, validateBody('updateLeadStatus'), updateLeadStatus);
router.patch('/:id', requireRole('SALES', 'ADMIN', 'SUPER_ADMIN'), requireLeadOwnerOrAdmin, validateBody('createLead'), updateLead);
router.delete('/:id', requireRole('ADMIN', 'SUPER_ADMIN'), deleteLead);
router.post('/:id/follow-up', requireRole('SALES', 'ADMIN', 'SUPER_ADMIN'), requireLeadOwnerOrAdmin, validateBody('sendFollowUp'), sendFollowUp);

export default router;
