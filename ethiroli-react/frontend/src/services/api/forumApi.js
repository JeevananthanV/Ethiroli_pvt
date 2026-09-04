import axiosInstance from './axiosInstance.js';

export const getForumPosts = async (params) => {
  const response = await axiosInstance.get('/v1/forum/posts', { params });
  return response.data;
};

export const createPost = async (postData) => {
  const response = await axiosInstance.post('/v1/forum/posts', postData);
  return response.data;
};

export const getPost = async (id) => {
  const response = await axiosInstance.get(`/v1/forum/posts/${id}`);
  return response.data;
};

export const addReply = async (postId, replyData) => {
  const response = await axiosInstance.post(`/v1/forum/posts/${postId}/replies`, replyData);
  return response.data;
};
