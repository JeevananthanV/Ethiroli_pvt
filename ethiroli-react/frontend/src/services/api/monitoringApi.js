import axiosInstance from './axiosInstance.js';

export const listErrorLogs = async (params) => {
  const response = await axiosInstance.get('/v1/monitoring/errors', { params });
  return response.data;
};
export const getErrorLogs = listErrorLogs;

export const resolveError = async (id) => {
  const response = await axiosInstance.patch(`/v1/monitoring/errors/${id}/resolve`);
  return response.data;
};

export const getSystemHealth = async () => {
  const response = await axiosInstance.get('/v1/system/health');
  return response.data;
};
