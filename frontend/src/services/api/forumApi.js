import axios from '../axios'

const unwrap = (response) => {
  const body = response?.data || response;
  if (body && !Array.isArray(body) && !(body instanceof String)) {
    if (body.data !== undefined) return body.data;
  }
  return body;
}

export const getAllThreads = async (params) => {
  const items = await unwrap(await axios.get('/forum/posts', { params }));
  if (!Array.isArray(items)) return [];
  // Normalize backend forum_posts into the shape the forum UIs expect.
  return items.map((p) => ({
    id: p.id,
    course_id: p.course_id,
    title: p.title,
    content: p.content,
    excerpt: p.content || '',
    category: p.category || 'general',
    author: p.author_name || p.author || 'Unknown',
    author_id: p.author_id,
    replies: [],
    replyCount: Number(p.reply_count ?? p.replyCount ?? 0) || 0,
    upvotes: Number(p.upvotes ?? 0) || 0,
    hasVoted: Boolean(p.viewer_has_voted),
    updatedAt: p.updated_at || p.created_at,
    lastActive: p.updated_at || p.created_at,
    pinned: !!p.is_pinned,
    locked: !!p.is_locked,
    status: p.status || (p.is_locked ? 'locked' : 'active')
  }));
}

export const listThreads = getAllThreads

export const getThread = async (id) => {
  const post = await unwrap(await axios.get(`/forum/posts/${id}`));
  return post && !Array.isArray(post) ? { ...post, replies: post.replies || [] } : post;
}

export const createThread = async (data) => {
  const { title, content, course_id, category, ...rest } = data || {};
  const payload = {
    title: title ?? rest.subject,
    content: content ?? rest.text,
    ...(course_id ? { course_id } : {}),
    ...(category ? { category } : {}),
    ...rest,
  };
  const response = await axios.post('/forum/posts', payload);
  return unwrap(response);
}

export const getPost = async (id) => {
  const post = await unwrap(await axios.get(`/forum/posts/${id}`));
  return post && !Array.isArray(post) ? { ...post, replies: post.replies || [] } : post;
}

export const createReply = async (threadId, data) => {
  const { text, ...rest } = data || {};
  const payload = { ...rest, content: data?.content ?? text };
  const response = await axios.post(`/forum/posts/${threadId}/replies`, payload);
  return unwrap(response);
}

export const votePost = async (postId, value) => {
  const response = await axios.post(`/forum/posts/${postId}/vote`, { value });
  return response.data?.data ?? response.data;
}

export const vote = votePost

export const getForumPosts = getAllThreads

export const listForumPosts = getAllThreads

export const forumApi = {
  getAllThreads,
  listThreads,
  getThread,
  createThread,
  getPost,
  getForumPosts,
  createReply,
  votePost,
  vote: votePost,
}

export default forumApi
