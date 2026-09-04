import axiosInstance from './axiosInstance.js';

export const listJobBoardPosts = async (params) => {
  const response = await axiosInstance.get('/v1/jobs-board/posts', { params });
  return response.data;
};
export const getJobBoardPosts = listJobBoardPosts;

export const createJobBoardPost = async (data) => {
  const response = await axiosInstance.post('/v1/jobs-board/post', data);
  return response.data;
};

export const getJobBoardPost = async (id) => {
  const response = await axiosInstance.get(`/v1/jobs-board/posts/${id}`);
  return response.data;
};

export const updateJobBoardPost = async (id, data) => {
  const response = await axiosInstance.patch(`/v1/jobs-board/posts/${id}`, data);
  return response.data;
};

export const deleteJobBoardPost = async (id) => {
  const response = await axiosInstance.delete(`/v1/jobs-board/posts/${id}`);
  return response.data;
};
