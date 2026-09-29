import Badge from '../models/Badge.js';
import UserBadge from '../models/UserBadge.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole, broadcastToUser } from '../services/socketService.js';

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
  const updated = await Badge.findById(req.params.id);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_BADGE',
    entity_type: 'BADGE',
    entity_id: req.params.id,
    old_value: badge,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  return success(res, 200, updated, 'Badge updated');
});

export const deleteBadge = asyncHandler(async (req, res) => {
  const badge = await Badge.findById(req.params.id);
  if (!badge) throw new NotFoundError('Badge not found');
  await Badge.delete(req.params.id);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'DELETE_BADGE',
    entity_type: 'BADGE',
    entity_id: req.params.id,
    old_value: badge,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  return success(res, 200, null, 'Badge deleted successfully');
});

export const getEarnedBadges = asyncHandler(async (req, res) => {
  const userId = req.params.userId || req.user.id;
  const list = await UserBadge.findByUserId(userId);
  return success(res, 200, list, 'Earned badges retrieved');
});

export const awardBadge = asyncHandler(async (req, res) => {
  const user_id = req.body.user_id || req.body.userId;
  const badge_id = req.body.badge_id || req.body.badgeId;
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

