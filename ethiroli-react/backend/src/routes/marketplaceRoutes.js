import express from 'express';
import { listProducts, publishProduct, getProduct, updateProduct, toggleFeatured } from '../controllers/marketplaceController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();

router.get('/marketplace/products', requireRole('EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), listProducts);
router.post('/marketplace/products', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), validateBody('createProduct'), publishProduct);
router.get('/marketplace/products/:id', requireRole('EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), getProduct);
router.patch('/marketplace/products/:id', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), validateBody('createProduct'), updateProduct);
router.patch('/marketplace/products/:id/feature', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), toggleFeatured);

export default router;
