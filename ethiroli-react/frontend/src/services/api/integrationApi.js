import axiosInstance from './axiosInstance.js';

export const listIntegrations = async () => {
  const response = await axiosInstance.get('/v1/integrations');
  return response.data;
};
export const getIntegrations = listIntegrations;

export const saveIntegration = async (data) => {
  const response = await axiosInstance.post('/v1/integrations', data);
  return response.data;
};

export const updateIntegration = async (id, data) => {
  const response = await axiosInstance.patch(`/v1/integrations/${id}`, data);
  return response.data;
};

export const deleteIntegration = async (id) => {
  const response = await axiosInstance.delete(`/v1/integrations/${id}`);
  return response.data;
};
