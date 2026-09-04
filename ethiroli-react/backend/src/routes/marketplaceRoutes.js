import express from 'express';
import { listProducts, publishProduct } from '../controllers/marketplaceController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/marketplace/products', listProducts);
router.post('/marketplace/products', authenticate, publishProduct);

export default router;
