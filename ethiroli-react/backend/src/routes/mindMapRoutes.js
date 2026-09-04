import express from 'express';
import { listMindMapNodes, createMindMapNode } from '../controllers/mindMapController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/mindmap/nodes', listMindMapNodes);
router.post('/mindmap/nodes', createMindMapNode);

export default router;
