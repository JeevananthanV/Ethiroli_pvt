import { validateRequired, validateUUID, validateEnum, sanitizeInput } from '../utils/validators.js';
import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import AuditLog from '../models/AuditLog.js';
import pool from '../config/database.js';
import { broadcastToUser, broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';

const PAYMENT_STATUSES = ['PENDING', 'PAID', 'FAILED', 'REFUNDED'];
const PAYMENT_METHODS = ['RAZORPAY', 'STRIPE', 'BANK_TRANSFER'];

export const listOrders = asyncHandler(async (req, res) => {
  const tenantId = req.tenant?.id;
  if (!tenantId) {
    throw new ValidationError('Tenant context is required.');
  }

  const list = await Order.list({ tenant_id: tenantId, payment_status: req.query.payment_status, user_id: req.query.user_id });
  return success(res, 200, list);
});

export const getOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const tenantId = req.tenant?.id;

  if (!validateUUID(id)) {
    throw new ValidationError('Invalid order ID format.');
  }

  const order = await Order.findById(id);
  if (!order || order.tenant_id !== tenantId) {
    throw new NotFoundError('Order not found.');
  }

  const items = await OrderItem.listByOrderId(id);
  return success(res, 200, { ...order, items });
});

export const createOrder = asyncHandler(async (req, res) => {
  const tenantId = req.tenant?.id;
  if (!tenantId) {
    throw new ValidationError('Tenant context is required.');
  }

  const body = sanitizeInput(req.body);
  const { order_number, subtotal, total, customer_name, customer_email, payment_method, billing_address, items, coupon_code } = body;

  const missing = validateRequired(body, ['order_number', 'subtotal', 'total', 'customer_name', 'customer_email']);
  if (missing.length > 0) {
    throw new ValidationError('Missing required fields.', { missing });
  }

  if (!validateEnum(payment_method, PAYMENT_METHODS)) {
    throw new ValidationError('Invalid payment method.', { allowed: PAYMENT_METHODS });
  }

  let discountAmount = 0;
  if (coupon_code) {
    const coupon = await Coupon.findByCode(tenantId, coupon_code);
    if (!coupon) {
      throw new NotFoundError('Invalid coupon code.');
    }
    if (!coupon.is_active) {
      throw new ValidationError('Coupon is not active.');
    }
    if (new Date() < new Date(coupon.valid_from) || new Date() > new Date(coupon.valid_to)) {
      throw new ValidationError('Coupon is not valid for this date.');
    }
    if (parseFloat(subtotal) < parseFloat(coupon.min_order_value)) {
      throw new ValidationError('Order value does not meet minimum for this coupon.');
    }

    if (coupon.discount_type === 'PERCENTAGE') {
      discountAmount = (parseFloat(subtotal) * parseFloat(coupon.discount_value)) / 100;
      if (coupon.max_discount_amount && discountAmount > parseFloat(coupon.max_discount_amount)) {
        discountAmount = parseFloat(coupon.max_discount_amount);
      }
    } else {
      discountAmount = parseFloat(coupon.discount_value);
    }

    await Coupon.incrementUsage(coupon.id);
  }

  const orderId = await Order.create({
    tenant_id: tenantId,
    user_id: req.user?.id || null,
    order_number,
    subtotal: parseFloat(subtotal),
    discount_amount: discountAmount,
    coupon_code: coupon_code || null,
    total: parseFloat(total),
    payment_method: payment_method || 'RAZORPAY',
    payment_status: 'PENDING',
    billing_address: billing_address || null,
    customer_name,
    customer_email,
    customer_phone: body.customer_phone || null
  });

  if (items && Array.isArray(items)) {
    for (const item of items) {
      const productId = item.product_id;
      const courseId = item.course_id;
      const priceAtPurchase = parseFloat(item.price_at_purchase);
      const quantity = parseInt(item.quantity, 10) || 1;

      if (!validateUUID(productId) || !validateUUID(courseId)) {
        await Order.delete(orderId);
        throw new ValidationError('Invalid product or course ID in items.');
      }

      const product = await Product.findById(productId);
      if (!product || product.tenant_id !== tenantId) {
        await Order.delete(orderId);
        throw new NotFoundError(`Product ${productId} not found.`);
      }

      await OrderItem.create({
        order_id: orderId,
        product_id: productId,
        course_id: courseId,
        price_at_purchase: priceAtPurchase,
        quantity
      });
    }
  }

  await AuditLog.create({
    user_id: req.user?.id || null,
    action: 'CREATE_ORDER',
    entity_type: 'ORDER',
    entity_id: orderId,
    new_value: body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  broadcastToUser(req.user?.id, 'order_created', { id: orderId, order_number, total });
  if (req.user?.role === 'STUDENT') {
    broadcastToRole('SALES', 'new_order', { id: orderId, customer_name });
  }

  return success(res, 201, { message: 'Order created.', id: orderId });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!validateUUID(id)) {
    throw new ValidationError('Invalid order ID format.');
  }

  const { payment_status, payment_id } = req.body;
  if (!validateEnum(payment_status, PAYMENT_STATUSES)) {
    throw new ValidationError('Invalid payment status.', { allowed: PAYMENT_STATUSES });
  }

  const existing = await Order.findById(id);
  if (!existing) {
    throw new NotFoundError('Order not found.');
  }

  await Order.update(id, {
    payment_status,
    payment_id: payment_id || existing.payment_id,
    paid_at: payment_status === 'PAID' ? new Date() : existing.paid_at
  });

  await AuditLog.create({
    user_id: req.user?.id || null,
    action: 'UPDATE_ORDER_STATUS',
    entity_type: 'ORDER',
    entity_id: id,
    old_value: { payment_status: existing.payment_status },
    new_value: { payment_status },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  broadcastToUser(existing.user_id, 'order_status_updated', { id, payment_status });
  broadcastToRole('FINANCE', 'order_payment_received', { id, payment_status });

  return success(res, 200, { message: 'Order status updated.' });
});
