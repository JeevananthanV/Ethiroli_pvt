import axiosInstance from './axiosInstance.js';

export const getIntegrations = async () => {
  const response = await axiosInstance.get('/v1/integrations');
  return response.data;
};

export const listIntegrations = getIntegrations;

export const saveIntegration = async (data) => {
  const response = await axiosInstance.post('/v1/integrations', data);
  return response.data;
};

export const integrationApi = {
  getIntegrations,
  listIntegrations,
  saveIntegration,
};

export default integrationApi;
