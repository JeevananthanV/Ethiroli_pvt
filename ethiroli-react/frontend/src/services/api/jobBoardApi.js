import axiosInstance from './axiosInstance.js';

export const getJobBoardPosts = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/v1/jobs-board/posts', { params });
    return response.data?.data || response.data || [];
  } catch {
    // Try fallback to /v1/jobs
    try {
      const fallback = await axiosInstance.get('/v1/jobs', { params });
      return fallback.data?.data || fallback.data || [];
    } catch {
      return [];
    }
  }
};

export const listJobBoardPosts = getJobBoardPosts;

export const getJobBoardPost = async (id) => {
  const response = await axiosInstance.get(`/v1/jobs-board/posts/${id}`);
  return response.data?.data || response.data;
};

export const createJobBoardPost = async (data) => {
  const response = await axiosInstance.post('/v1/jobs-board/post', data);
  return response.data?.data || response.data;
};

export const updateJobBoardPost = async (id, data) => {
  const response = await axiosInstance.patch(`/v1/jobs-board/posts/${id}`, data);
  return response.data?.data || response.data;
};

export const deleteJobBoardPost = async (id) => {
  const response = await axiosInstance.delete(`/v1/jobs-board/posts/${id}`);
  return response.data?.data || response.data;
};

export const getJobBoardAnalytics = async (id) => {
  const response = await axiosInstance.get(`/v1/jobs-board/posts/${id}/analytics`);
  return response.data?.data || response.data;
};

export const publishJobBoardPost = async (id, platforms) => {
  const response = await axiosInstance.post(`/v1/jobs-board/posts/${id}/publish`, { platforms });
  return response.data?.data || response.data;
};

export const jobBoardApi = {
  getJobBoardPosts,
  listJobBoardPosts,
  getJobBoardPost,
  createJobBoardPost,
  updateJobBoardPost,
  deleteJobBoardPost,
  getJobBoardAnalytics,
  publishJobBoardPost,
};

export default jobBoardApi;
