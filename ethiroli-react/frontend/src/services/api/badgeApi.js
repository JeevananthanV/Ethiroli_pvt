import axiosInstance from './axiosInstance.js';

export const getBadges = async () => {
  const response = await axiosInstance.get('/v1/badges');
  return response.data;
};
export const listBadges = getBadges;

export const createBadge = async (data) => {
  const response = await axiosInstance.post('/v1/badges', data);
  return response.data;
};

export const getEarnedBadges = async (userId) => {
  const response = await axiosInstance.get(userId ? `/v1/user-badges/${userId}` : '/v1/user-badges');
  return response.data;
};
export const getUserBadges = getEarnedBadges;
