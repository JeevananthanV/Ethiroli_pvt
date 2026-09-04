import axiosInstance from './axiosInstance.js';

export const getApiKeys = async () => {
  const response = await axiosInstance.get('/v1/developer/api-keys');
  return response.data;
};

export const createApiKey = async (keyData) => {
  const response = await axiosInstance.post('/v1/developer/api-keys', keyData);
  return response.data;
};
