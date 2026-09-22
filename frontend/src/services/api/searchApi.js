import axiosInstance from './axiosInstance.js';

export const globalSearch = async (query) => {
  const response = await axiosInstance.get('/v1/search', { params: { q: query } });
  return response.data;
};
