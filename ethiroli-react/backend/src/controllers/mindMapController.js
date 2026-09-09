import MindMapNode from '../models/MindMapNode.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listMindMapNodes = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [items, countRow] = await Promise.all([
    MindMapNode.list({ user_id: req.user.id, limit: parseInt(limit), offset }),
    MindMapNode.count({ user_id: req.user.id })
  ]);

  return success(res, 200, items, 'Mind map nodes retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total: countRow,
    totalPages: Math.ceil(countRow / parseInt(limit))
  });
});

export const createMindMapNode = asyncHandler(async (req, res) => {
  const id = await MindMapNode.create({ ...req.body, user_id: req.user.id });
  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_MIND_MAP_NODE',
    entity_type: 'MIND_MAP_NODE',
    entity_id: id,
    new_value: { ...req.body, user_id: req.user.id },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('STUDENT', 'mindmap_node_created', { id });
  return success(res, 201, { id }, 'Mind map node created');
});

export const getMindMapNode = asyncHandler(async (req, res) => {
  const node = await MindMapNode.findById(req.params.id);
  if (!node) throw new NotFoundError('Mind map node not found');
  return success(res, 200, node, 'Mind map node retrieved');
});

export const updateMindMapNode = asyncHandler(async (req, res) => {
  const node = await MindMapNode.findById(req.params.id);
  if (!node) throw new NotFoundError('Mind map node not found');
  await MindMapNode.update(req.params.id, req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_MIND_MAP_NODE',
    entity_type: 'MIND_MAP_NODE',
    entity_id: req.params.id,
    old_value: node,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('STUDENT', 'mindmap_node_updated', { id: req.params.id });
  return success(res, 200, null, 'Mind map node updated');
});

export const deleteMindMapNode = asyncHandler(async (req, res) => {
  const node = await MindMapNode.findById(req.params.id);
  if (!node) throw new NotFoundError('Mind map node not found');
  await MindMapNode.delete(req.params.id);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'DELETE_MIND_MAP_NODE',
    entity_type: 'MIND_MAP_NODE',
    entity_id: req.params.id,
    old_value: node,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('STUDENT', 'mindmap_node_deleted', { id: req.params.id });
  return success(res, 200, null, 'Mind map node deleted');
});

export const shareMindMapNode = asyncHandler(async (req, res) => {
  const node = await MindMapNode.findById(req.params.id);
  if (!node) throw new NotFoundError('Mind map node not found');
  return success(res, 200, { share_url: `/mindmap/shared/${req.params.id}` }, 'Mind map node shared');
});
