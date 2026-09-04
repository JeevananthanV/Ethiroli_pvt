import axiosInstance from './axiosInstance.js';

export const listReportDefinitions = async () => {
  const response = await axiosInstance.get('/v1/reports/definitions');
  return response.data;
};

export const createReportDefinition = async (reportData) => {
  const response = await axiosInstance.post('/v1/reports/definitions', reportData);
  return response.data;
};

export const executeReport = async (reportId) => {
  const response = await axiosInstance.post('/v1/reports/execute', { reportId });
  return response.data;
};
