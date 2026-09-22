import PerformanceReview from '../models/PerformanceReview.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listReviews = asyncHandler(async (req, res) => {
  const { employee_id, reviewer_id, page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [items, countRow] = await Promise.all([
    PerformanceReview.list({ employee_id, reviewer_id, limit: parseInt(limit), offset }),
    PerformanceReview.count({ employee_id, reviewer_id })
  ]);

  return success(res, 200, items, 'Performance reviews retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total: countRow,
    totalPages: Math.ceil(countRow / parseInt(limit))
  });
});

export const createReview = asyncHandler(async (req, res) => {
  const id = await PerformanceReview.create({ ...req.body, reviewer_id: req.user.id });
  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_PERFORMANCE_REVIEW',
    entity_type: 'PERFORMANCE_REVIEW',
    entity_id: id,
    new_value: { ...req.body, reviewer_id: req.user.id },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('HR', 'performance_review_created', { id });
  return success(res, 201, { id }, 'Performance review submitted');
});

export const getReview = asyncHandler(async (req, res) => {
  const review = await PerformanceReview.findById(req.params.id);
  if (!review) throw new NotFoundError('Performance review not found');
  return success(res, 200, review, 'Performance review retrieved');
});

export const updateReview = asyncHandler(async (req, res) => {
  const review = await PerformanceReview.findById(req.params.id);
  if (!review) throw new NotFoundError('Performance review not found');
  await PerformanceReview.update(req.params.id, req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_PERFORMANCE_REVIEW',
    entity_type: 'PERFORMANCE_REVIEW',
    entity_id: req.params.id,
    old_value: review,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('HR', 'performance_review_updated', { id: req.params.id });
  return success(res, 200, null, 'Performance review updated successfully');
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await PerformanceReview.findById(req.params.id);
  if (!review) throw new NotFoundError('Performance review not found');
  await PerformanceReview.delete(req.params.id);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'DELETE_PERFORMANCE_REVIEW',
    entity_type: 'PERFORMANCE_REVIEW',
    entity_id: req.params.id,
    old_value: review,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('HR', 'performance_review_deleted', { id: req.params.id });
  return success(res, 200, null, 'Performance review deleted successfully');
});
