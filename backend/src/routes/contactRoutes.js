import express from 'express';
import {
  listContactMessages,
  getContactMessage,
  createContactMessage,
  deleteContactMessage,
  convertInquiryToLead
} from '../controllers/contactController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

// Public submission endpoints (supports POST / or POST /contact-messages)
router.post('/', createContactMessage);
router.post('/contact-messages', createContactMessage);

// Protected endpoints for staff
router.get('/', authenticate, requireRole('HR', 'ADMIN', 'SUPER_ADMIN', 'SALES', 'RECEPTION'), listContactMessages);
router.get('/contact-messages', authenticate, requireRole('HR', 'ADMIN', 'SUPER_ADMIN', 'SALES', 'RECEPTION'), listContactMessages);
router.get('/:id', authenticate, requireRole('HR', 'ADMIN', 'SUPER_ADMIN', 'SALES', 'RECEPTION'), getContactMessage);
router.delete('/:id', authenticate, requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), deleteContactMessage);
router.post('/:id/convert', authenticate, requireRole('HR', 'ADMIN', 'SUPER_ADMIN', 'SALES', 'RECEPTION'), convertInquiryToLead);

export default router;
