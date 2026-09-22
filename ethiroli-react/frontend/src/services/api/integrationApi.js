import axiosInstance from './axiosInstance.js';

export const getIntegrations = async () => {
  const response = await axiosInstance.get('/v1/integrations');
  return response?.data || response;
};

export const listIntegrations = getIntegrations;

export const saveIntegration = async (data) => {
  const response = await axiosInstance.post('/v1/integrations', data);
  return response?.data || response;
};

export const testConnection = async (id) => {
  const response = await axiosInstance.post(`/v1/integrations/${id}/test`);
  return response?.data || response;
};

export const getBrevoQuota = async () => {
  const response = await axiosInstance.get('/v1/integrations/brevo/quota');
  return response?.data || response;
};

export const sendBrevoTest = async (email) => {
  const response = await axiosInstance.post('/v1/integrations/brevo/test', { email });
  return response?.data || response;
};

export const testN8n = async (url, secret) => {
  const response = await axiosInstance.post('/v1/integrations/n8n/test', { url, secret });
  return response?.data || response;
};

export const integrationApi = {
  getIntegrations,
  listIntegrations,
  saveIntegration,
  testConnection,
  getBrevoQuota,
  sendBrevoTest,
  testN8n
};

export default integrationApi;
