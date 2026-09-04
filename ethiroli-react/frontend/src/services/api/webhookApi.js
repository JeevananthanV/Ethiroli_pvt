import axiosInstance from './axiosInstance.js';

export const getWebhooks = async () => {
  const response = await axiosInstance.get('/v1/developer/webhooks');
  return response.data;
};

export const createWebhook = async (webhookData) => {
  const response = await axiosInstance.post('/v1/developer/webhooks', webhookData);
  return response.data;
};
