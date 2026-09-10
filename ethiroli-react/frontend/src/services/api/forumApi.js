import axios from '../axios'

export const getAllThreads = async () => {
  const response = await axios.get('/forum/threads')
  return response.data
}

export const listThreads = getAllThreads

export const getThread = async (id) => {
  const response = await axios.get(`/forum/threads/${id}`)
  return response.data
}

export const createThread = async (data) => {
  const response = await axios.post('/forum/threads', data)
  return response.data
}

export const getPost = async (id) => {
  const response = await axios.get(`/forum/posts/${id}`)
  return response.data
}

export const createReply = async (threadId, data) => {
  const response = await axios.post(`/forum/threads/${threadId}/replies`, data)
  return response.data
}

export const votePost = async (postId, value) => {
  const response = await axios.post(`/forum/posts/${postId}/vote`, { value })
  return response.data
}

export const vote = votePost

export const getForumPosts = getAllThreads

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
};

export default forumApi;
