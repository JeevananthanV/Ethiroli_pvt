import Coupon from '../models/Coupon.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listCoupons = asyncHandler(async (req, res) => {
  const { is_active, page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [items, countRow] = await Promise.all([
    Coupon.list({ tenant_id: req.tenant?.id, is_active, limit: parseInt(limit), offset }),
    Coupon.count({ tenant_id: req.tenant?.id, is_active })
  ]);

  return success(res, 200, items, 'Coupons retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total: countRow,
    totalPages: Math.ceil(countRow / parseInt(limit))
  });
});

export const createCoupon = asyncHandler(async (req, res) => {
  const id = await Coupon.create({ ...req.body, tenant_id: req.tenant?.id, created_by: req.user.id });
  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_COUPON',
    entity_type: 'COUPON',
    entity_id: id,
    new_value: { ...req.body, tenant_id: req.tenant?.id, created_by: req.user.id },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'coupon_created', { id });
  return success(res, 201, { id }, 'Coupon generated');
});

export const getCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) throw new NotFoundError('Coupon not found');
  return success(res, 200, coupon, 'Coupon retrieved');
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) throw new NotFoundError('Coupon not found');
  await Coupon.update(req.params.id, req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_COUPON',
    entity_type: 'COUPON',
    entity_id: req.params.id,
    old_value: coupon,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'coupon_updated', { id: req.params.id });
  return success(res, 200, null, 'Coupon updated successfully');
});

export const validateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByCode(req.body.code);
  if (!coupon) throw new NotFoundError('Invalid coupon code');
  return success(res, 200, { valid: true, coupon }, 'Coupon is valid');
});
