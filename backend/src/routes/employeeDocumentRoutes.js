import express from 'express';
import {
  listDocuments,
  uploadDocument,
  getDocument,
  verifyDocument,
  deleteDocument
} from '../controllers/employeeDocumentController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();
router.use(authenticate);

router.get('/documents', requireRole('HR', 'ADMIN', 'SUPER_ADMIN', 'EMPLOYEE', 'INTERN'), listDocuments);
router.post('/documents', requireRole('HR', 'ADMIN', 'SUPER_ADMIN', 'EMPLOYEE', 'INTERN'), uploadDocument);
router.get('/documents/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN', 'EMPLOYEE', 'INTERN'), getDocument);
router.patch('/documents/:id/verify', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), verifyDocument);
router.delete('/documents/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), deleteDocument);

export default router;
