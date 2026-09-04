import axiosInstance from './axiosInstance.js';

export const getAuditLogs = async (params) => {
  const response = await axiosInstance.get('/v1/audit-logs', { params });
  return response.data;
};
