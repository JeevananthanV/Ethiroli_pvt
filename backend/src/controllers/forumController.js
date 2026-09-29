import ForumPost from '../models/ForumPost.js';
import ForumReply from '../models/ForumReply.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError, AuthorizationError, BadRequestError } from '../utils/errors.js';

const toBool = (value) => {
  if (value === undefined) return undefined;
  return value === true || value === 'true' || value === '1';
};

export const listPosts = asyncHandler(async (req, res) => {
  const { course_id, category, is_pinned, is_locked, page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const filters = {
    course_id,
    category,
    is_pinned: toBool(is_pinned),
    is_locked: toBool(is_locked),
    viewer_id: req.user.id
  };

  const [items, countRow] = await Promise.all([
    ForumPost.list({ ...filters, limit: parseInt(limit), offset }),
    ForumPost.count(filters)
  ]);

  res.locals.meta = {
    page: parseInt(page),
    limit: parseInt(limit),
    total: countRow,
    totalPages: Math.ceil(countRow / parseInt(limit))
  };
  return success(res, 200, items, 'Forum posts retrieved');
});

export const createPost = asyncHandler(async (req, res) => {
  const { course_id, title, content } = req.body;
  // forum_posts.course_id is NOT NULL - reject early with a clear message
  // instead of surfacing a raw SQL integrity error.
  if (!course_id) throw new BadRequestError('course_id is required to start a thread.');
  if (!title) throw new BadRequestError('title is required.');
  if (!content) throw new BadRequestError('content is required.');

  const id = await ForumPost.create({ ...req.body, author_id: req.user.id });
  broadcastToRole('STUDENT', 'forum_post_created', { id });
  return success(res, 201, { id }, 'Post created successfully');
});

export const votePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await ForumPost.findById(id);
  if (!post) throw new NotFoundError('Post not found');

  const result = await ForumPost.toggleVote(id, req.user.id);
  return success(res, 200, { id, upvotes: result.upvotes, voted: result.voted }, 'Vote recorded');
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
