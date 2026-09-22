import axiosInstance from './axiosInstance.js';

export const getReports = async (params) => {
  const response = await axiosInstance.get('/v1/reports', { params });
  return response.data;
};

export const getReport = async (id) => {
  const response = await axiosInstance.get(`/v1/reports/${id}`);
  return response.data;
};

export const createReport = async (reportData) => {
  const response = await axiosInstance.post('/v1/reports', reportData);
  return response.data;
};

export const updateReport = async (id, reportData) => {
  const response = await axiosInstance.put(`/v1/reports/${id}`, reportData);
  return response.data;
};

export const deleteReport = async (id) => {
  const response = await axiosInstance.delete(`/v1/reports/${id}`);
  return response.data;
};

export const generateReport = async (id) => {
  const response = await axiosInstance.post(`/v1/reports/${id}/generate`);
  return response.data;
};

export const getReportFields = async (type) => {
  const response = await axiosInstance.get(`/v1/reports/fields/${type}`);
  return response.data;
};

export const previewReport = async (reportData) => {
  const response = await axiosInstance.post('/v1/reports/preview', reportData);
  return response.data;
};

export const scheduleReport = async (reportId, schedule) => {
  const response = await axiosInstance.post(`/v1/reports/${reportId}/schedule`, schedule);
  return response.data;
};

export const listReportDefinitions = getReports;
export const executeReport = generateReport;

export const reportApi = {
  getAll: getReports,
  getReports,
  listReportDefinitions,
  getReport,
  createReport,
  updateReport,
  deleteReport,
  generateReport,
  executeReport,
  getReportFields,
  previewReport,
  scheduleReport,
};

export default reportApi;
