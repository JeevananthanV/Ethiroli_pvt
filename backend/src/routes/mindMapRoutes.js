import express from 'express';
import { listMindMapNodes, createMindMapNode, getMindMapNode, updateMindMapNode, deleteMindMapNode, shareMindMapNode } from '../controllers/mindMapController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

router.get('/mindmap/nodes', requireRole('STUDENT', 'EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), listMindMapNodes);
router.post('/mindmap/nodes', requireRole('TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN'), validateBody('createMindMapNode'), createMindMapNode);
router.get('/mindmap/nodes/:id', requireRole('STUDENT', 'EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), getMindMapNode);
router.patch('/mindmap/nodes/:id', requireRole('TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN'), validateBody('createMindMapNode'), updateMindMapNode);
router.delete('/mindmap/nodes/:id', requireRole('TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN'), deleteMindMapNode);
router.post('/mindmap/nodes/:id/share', requireRole('TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN'), shareMindMapNode);

export default router;
