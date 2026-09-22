import ActivityFeed from '../models/ActivityFeed.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToUser } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';

export const getFeed = asyncHandler(async (req, res) => {
  const { limit = 50, offset = 0 } = req.query;

  const feeds = await ActivityFeed.listForUser(req.user.id, {
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10)
  });

  return success(res, 200, feeds, 'Activity feed retrieved');
});

export const markRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await ActivityFeed.markAsRead(id, req.user.id);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'MARK_FEED_READ',
    entity_type: 'ACTIVITY_FEED',
    entity_id: id,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToUser(req.user.id, 'activity_marked_read', { id });
  return success(res, 200, null, 'Activity marked as read');
});

export const markAllRead = asyncHandler(async (req, res) => {
  const feeds = await ActivityFeed.listForUser(req.user.id, { limit: 1000, offset: 0 });
  for (const feed of feeds) {
    if (!feed.is_read) {
      await ActivityFeed.markAsRead(feed.id, req.user.id);
    }
  }
  await AuditLog.create({
    user_id: req.user.id,
    action: 'MARK_ALL_FEED_READ',
    entity_type: 'ACTIVITY_FEED',
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToUser(req.user.id, 'all_activities_marked_read', {});
  return success(res, 200, null, 'All activities marked as read');
});
