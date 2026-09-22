import express from 'express';
import { listInvoices, generateInvoice, batchGenerateInvoices, getInvoice, updateInvoiceStatus, markPaid, voidInvoice } from '../controllers/invoiceController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();

router.use(authenticate);

router.get('/invoices', requireRole('FINANCE', 'ADMIN', 'SUPER_ADMIN', 'PROJECT_MANAGER'), listInvoices);
router.post('/invoices', requireRole('FINANCE', 'PROJECT_MANAGER', 'ADMIN'), validateBody('createInvoice'), generateInvoice);
router.post('/invoices/batch', requireRole('FINANCE', 'ADMIN'), batchGenerateInvoices);
router.get('/invoices/:id', requireRole('FINANCE', 'ADMIN', 'SUPER_ADMIN', 'PROJECT_MANAGER'), getInvoice);
router.patch('/invoices/:id/status', requireRole('FINANCE', 'ADMIN', 'SUPER_ADMIN', 'PROJECT_MANAGER'), validateBody('updateInvoiceStatus'), updateInvoiceStatus);
router.post('/invoices/:id/mark-paid', requireRole('FINANCE', 'ADMIN'), validateBody('markPaid'), markPaid);
router.post('/invoices/:id/void', requireRole('ADMIN', 'SUPER_ADMIN'), validateBody('voidInvoice'), voidInvoice);

export default router;
