import axiosInstance from './axiosInstance.js';

export const getApiKeys = async () => {
  const response = await axiosInstance.get('/v1/api-keys');
  return response.data;
};

export const createApiKey = async (data) => {
  const response = await axiosInstance.post('/v1/api-keys', data);
  return response.data;
};
