import axiosInstance from './axiosInstance.js';

export const getFeed = async (params) => {
  const response = await axiosInstance.get('/v1/activity-feed', { params });
  return response.data;
};

export const markRead = async (id) => {
  const response = await axiosInstance.patch(`/v1/activity-feed/${id}/read`);
  return response.data;
};
