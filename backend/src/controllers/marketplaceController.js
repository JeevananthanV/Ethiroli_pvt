import Product from '../models/Product.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listProducts = asyncHandler(async (req, res) => {
  const { tenant_id, is_featured, category, page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [items, countRow] = await Promise.all([
    Product.list({ tenant_id: req.tenant?.id, is_featured, category, limit: parseInt(limit), offset }),
    Product.count({ tenant_id: req.tenant?.id, is_featured, category })
  ]);

  return success(res, 200, items, 'Products retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total: countRow,
    totalPages: Math.ceil(countRow / parseInt(limit))
  });
});

export const publishProduct = asyncHandler(async (req, res) => {
  const id = await Product.create({ ...req.body, tenant_id: req.tenant?.id });
  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_PRODUCT',
    entity_type: 'PRODUCT',
    entity_id: id,
    new_value: { ...req.body, tenant_id: req.tenant?.id },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'product_published', { id });
  return success(res, 201, { id }, 'Product published to marketplace');
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new NotFoundError('Product not found');
  return success(res, 200, product, 'Product retrieved');
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new NotFoundError('Product not found');
  await Product.update(req.params.id, req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_PRODUCT',
    entity_type: 'PRODUCT',
    entity_id: req.params.id,
    old_value: product,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'product_updated', { id: req.params.id });
  return success(res, 200, null, 'Product updated successfully');
});

export const toggleFeatured = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new NotFoundError('Product not found');
  await Product.update(req.params.id, { is_featured: !product.is_featured });
  await AuditLog.create({
    user_id: req.user.id,
    action: 'TOGGLE_PRODUCT_FEATURED',
    entity_type: 'PRODUCT',
    entity_id: req.params.id,
    old_value: product,
    new_value: { is_featured: !product.is_featured },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'product_feature_toggled', { id: req.params.id });
  return success(res, 200, null, 'Product featured status toggled');
});
