import Subscription from '../models/Subscription.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole, broadcastToUser } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listSubscriptions = asyncHandler(async (req, res) => {
  const { client_id, status, page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [items, countRow] = await Promise.all([
    Subscription.list({ client_id, status, limit: parseInt(limit), offset }),
    Subscription.count({ client_id, status })
  ]);

  return success(res, 200, items, 'Subscriptions retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total: countRow,
    totalPages: Math.ceil(countRow / parseInt(limit))
  });
});

export const createSubscription = asyncHandler(async (req, res) => {
  const id = await Subscription.create(req.body);
  return success(res, 201, { id }, 'Subscription created successfully');
});

export const getSubscription = asyncHandler(async (req, res) => {
  const subscription = await Subscription.findById(req.params.id);
  if (!subscription) throw new NotFoundError('Subscription not found');
  return success(res, 200, subscription, 'Subscription retrieved');
});

export const updateSubscription = asyncHandler(async (req, res) => {
  const subscription = await Subscription.findById(req.params.id);
  if (!subscription) throw new NotFoundError('Subscription not found');
  await Subscription.update(req.params.id, req.body);
  return success(res, 200, null, 'Subscription updated successfully');
});

export const cancelSubscription = asyncHandler(async (req, res) => {
  const subscription = await Subscription.findById(req.params.id);
  if (!subscription) throw new NotFoundError('Subscription not found');
  await Subscription.update(req.params.id, { status: 'CANCELLED', cancelled_at: new Date() });
  return success(res, 200, null, 'Subscription cancelled');
});

export const pauseSubscription = asyncHandler(async (req, res) => {
  const subscription = await Subscription.findById(req.params.id);
  if (!subscription) throw new NotFoundError('Subscription not found');
  await Subscription.update(req.params.id, { status: 'PAUSED' });
  return success(res, 200, null, 'Subscription paused');
});

export const resumeSubscription = asyncHandler(async (req, res) => {
  const subscription = await Subscription.findById(req.params.id);
  if (!subscription) throw new NotFoundError('Subscription not found');
  await Subscription.update(req.params.id, { status: 'ACTIVE' });
  return success(res, 200, null, 'Subscription resumed');
});
