import axiosInstance from './axiosInstance.js';

export const getFeed = async () => {
  const response = await axiosInstance.get('/v1/feed');
  return response.data;
};

export const markRead = async (id) => {
  const response = await axiosInstance.post(`/v1/feed/${id}/read`);
  return response.data;
};
