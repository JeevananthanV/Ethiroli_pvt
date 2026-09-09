import ForumPost from '../models/ForumPost.js';
import ForumReply from '../models/ForumReply.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError, AuthorizationError } from '../utils/errors.js';

export const listPosts = asyncHandler(async (req, res) => {
  const { course_id, is_pinned, is_locked, page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [items, countRow] = await Promise.all([
    ForumPost.list({ course_id, is_pinned, is_locked, limit: parseInt(limit), offset }),
    ForumPost.count({ course_id, is_pinned, is_locked })
  ]);

  return success(res, 200, items, 'Forum posts retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total: countRow,
    totalPages: Math.ceil(countRow / parseInt(limit))
  });
});

export const createPost = asyncHandler(async (req, res) => {
  const id = await ForumPost.create({ ...req.body, author_id: req.user.id });
  broadcastToRole('STUDENT', 'forum_post_created', { id });
  return success(res, 201, { id }, 'Post created successfully');
});

export const getPost = asyncHandler(async (req, res) => {
  const post = await ForumPost.findById(req.params.id);
  if (!post) throw new NotFoundError('Post not found');
  const replies = await ForumReply.listByPostId(req.params.id);
  return success(res, 200, { ...post, replies }, 'Post retrieved');
});

export const addReply = asyncHandler(async (req, res) => {
  const post = await ForumPost.findById(req.params.id);
  if (!post) throw new NotFoundError('Post not found');
  if (post.is_locked) throw new AuthorizationError('Post is locked');
  const id = await ForumReply.create({ ...req.body, post_id: req.params.id, author_id: req.user.id });
  return success(res, 201, { id }, 'Reply added');
});

export const updatePost = asyncHandler(async (req, res) => {
  const post = await ForumPost.findById(req.params.id);
  if (!post) throw new NotFoundError('Post not found');
  await ForumPost.update(req.params.id, req.body);
  return success(res, 200, null, 'Post updated');
});

export const pinPost = asyncHandler(async (req, res) => {
  const post = await ForumPost.findById(req.params.id);
  if (!post) throw new NotFoundError('Post not found');
  await ForumPost.update(req.params.id, { is_pinned: !post.is_pinned });
  return success(res, 200, null, 'Post pinned status toggled');
});

export const lockPost = asyncHandler(async (req, res) => {
  const post = await ForumPost.findById(req.params.id);
  if (!post) throw new NotFoundError('Post not found');
  await ForumPost.update(req.params.id, { is_locked: !post.is_locked });
  return success(res, 200, null, 'Post locked status toggled');
});
