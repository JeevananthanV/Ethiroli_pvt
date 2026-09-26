import CartSession from '../models/CartSession.js';
import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
import Coupon from '../models/Coupon.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToUser } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const getCart = asyncHandler(async (req, res) => {
  const cart = await CartSession.findByUserId(req.user.id);
  if (!cart) {
    return success(res, 200, { items: [], total: 0 }, 'Cart retrieved');
  }

  const items = await CartSession.getItems(cart.id);
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return success(res, 200, { items, total }, 'Cart retrieved');
});

export const addToCart = asyncHandler(async (req, res) => {
  let cart = await CartSession.findByUserId(req.user.id);
  if (!cart) {
    const cartId = await CartSession.create({ user_id: req.user.id, tenant_id: req.tenant?.id });
    cart = { id: cartId };
  }

  await CartSession.addItem(cart.id, req.body.product_id, req.body.quantity);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'ADD_TO_CART',
    entity_type: 'CART_SESSION',
    entity_id: cart.id,
    new_value: { product_id: req.body.product_id, quantity: req.body.quantity },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToUser(req.user.id, 'cart_item_added', { cart_id: cart.id });
  return success(res, 201, null, 'Item added to cart');
});

export const applyCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByCode(req.tenant?.id, req.body.code);
  if (!coupon) throw new NotFoundError('Invalid coupon code');

  const cart = await CartSession.findByUserId(req.user.id);
  if (!cart) throw new NotFoundError('Cart not found');

  await CartSession.applyCoupon(cart.id, coupon.code);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'APPLY_COUPON',
    entity_type: 'CART_SESSION',
    entity_id: cart.id,
    new_value: { coupon_code: req.body.code },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToUser(req.user.id, 'coupon_applied', { cart_id: cart.id, coupon_code: req.body.code });
  return success(res, 200, { discount: coupon.discount_value, discount_type: coupon.discount_type }, 'Coupon applied');
});

export const checkoutCart = asyncHandler(async (req, res) => {
  const cart = await CartSession.findByUserId(req.user.id);
  if (!cart) throw new NotFoundError('Cart not found');

  const items = await CartSession.getItems(cart.id);
  if (items.length === 0) throw new NotFoundError('Cart is empty');

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  let coupon = null;
  if (cart.coupon_code) {
    coupon = await Coupon.findByCode(cart.tenant_id, cart.coupon_code);
  }
  const discountAmount = coupon
    ? Math.min(
      coupon.discount_type === 'PERCENTAGE'
        ? (subtotal * Number(coupon.discount_value)) / 100
        : Number(coupon.discount_value),
      coupon.max_discount_amount ? Number(coupon.max_discount_amount) : Number.POSITIVE_INFINITY
    )
    : 0;
  const total = Math.max(0, Number((subtotal - discountAmount).toFixed(2)));

  const orderId = await Order.create({
    tenant_id: cart.tenant_id,
    user_id: req.user.id,
    order_number: `ORD-${Date.now()}`,
    subtotal,
    discount_amount: discountAmount,
    coupon_code: cart.coupon_code || null,
    total,
    customer_name: req.user?.full_name || req.user?.name || 'Customer',
    customer_email: req.user?.email || null,
    payment_status: 'PENDING'
  });

  for (const item of items) {
    await OrderItem.create({
      order_id: orderId,
      product_id: item.product_id,
      course_id: item.course_id,
      price_at_purchase: item.price,
      quantity: item.quantity
    });
  }

  if (coupon) await Coupon.incrementUsage(coupon.id);
  await CartSession.clear(cart.id);

  await AuditLog.create({
    user_id: req.user.id,
    action: 'CHECKOUT_CART',
    entity_type: 'CART_SESSION',
    entity_id: cart.id,
    new_value: { order_id: orderId, total },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToUser(req.user.id, 'cart_checked_out', { order_id: orderId });
  return success(res, 200, { orderId, total }, 'Checkout successful');
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await CartSession.findByUserId(req.user.id);
  if (!cart) throw new NotFoundError('Cart not found');

  await CartSession.removeItem(cart.id, req.params.productId);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'REMOVE_FROM_CART',
    entity_type: 'CART_SESSION',
    entity_id: cart.id,
    new_value: { product_id: req.params.productId },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToUser(req.user.id, 'cart_item_removed', { cart_id: cart.id, product_id: req.params.productId });
  return success(res, 200, null, 'Item removed from cart');
});
