import Badge from '../models/Badge.js';
import UserBadge from '../models/UserBadge.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listBadges = asyncHandler(async (req, res) => {
  const list = await Badge.list();
  return success(res, 200, list, 'Badges retrieved');
});

export const createBadge = asyncHandler(async (req, res) => {
  const id = await Badge.create(req.body);
  return success(res, 201, { id }, 'Badge definition created');
});

export const getBadge = asyncHandler(async (req, res) => {
  const badge = await Badge.findById(req.params.id);
  if (!badge) throw new NotFoundError('Badge not found');
  return success(res, 200, badge, 'Badge retrieved');
});

export const updateBadge = asyncHandler(async (req, res) => {
  const badge = await Badge.findById(req.params.id);
  if (!badge) throw new NotFoundError('Badge not found');
  await Badge.update(req.params.id, req.body);
  return success(res, 200, null, 'Badge updated');
});

export const getEarnedBadges = asyncHandler(async (req, res) => {
  const userId = req.params.userId || req.user.id;
  const list = await UserBadge.findByUserId(userId);
  return success(res, 200, list, 'Earned badges retrieved');
});

export const awardBadge = asyncHandler(async (req, res) => {
  const { user_id, badge_id } = req.body;
  const id = await UserBadge.create({ user_id, badge_id });
  broadcastToUser(user_id, 'badge_awarded', { badge_id });
  return success(res, 201, { id }, 'Badge awarded');
});

export const revokeBadge = asyncHandler(async (req, res) => {
  const badge = await UserBadge.findById(req.params.id);
  if (!badge) throw new NotFoundError('Badge award not found');
  await UserBadge.delete(req.params.id);
  return success(res, 200, null, 'Badge revoked');
});
