import express from 'express';
import { getCart, checkoutCart } from '../controllers/cartController.js';

const router = express.Router();

router.get('/cart', getCart);
router.post('/cart/checkout', checkoutCart);

export default router;
