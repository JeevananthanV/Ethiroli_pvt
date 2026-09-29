import axiosInstance from './axiosInstance.js';

export const getDashboardMetrics = async () => {
  const response = await axiosInstance.get('/v1/hr/dashboard/metrics');
  return response.data || response;
};

export const listDocuments = async (params = {}) => {
  const response = await axiosInstance.get('/v1/documents', { params });
  return response.data || response;
};

export const uploadDocument = async (data) => {
  const response = await axiosInstance.post('/v1/documents', data);
  return response.data || response;
};

export const verifyDocument = async (id, status = 'VERIFIED') => {
  const response = await axiosInstance.patch(`/v1/documents/${id}/verify`, { status });
  return response.data || response;
};

export const deleteDocument = async (id) => {
  const response = await axiosInstance.delete(`/v1/documents/${id}`);
  return response.data || response;
};

export const listExitRequests = async (params = {}) => {
  const response = await axiosInstance.get('/v1/exit-requests', { params });
  return response.data || response;
};

export const createExitRequest = async (data) => {
  const response = await axiosInstance.post('/v1/exit-requests', data);
  return response.data || response;
};

export const getExitRequest = async (id) => {
  const response = await axiosInstance.get(`/v1/exit-requests/${id}`);
  return response.data || response;
};

export const updateExitRequest = async (id, data) => {
  const response = await axiosInstance.patch(`/v1/exit-requests/${id}`, data);
  return response.data || response;
};

export const updateChecklistTask = async (taskId, data) => {
  const response = await axiosInstance.patch(`/v1/exit-requests/tasks/${taskId}`, data);
  return response.data || response;
};

export default {
  getDashboardMetrics,
  listDocuments,
  uploadDocument,
  verifyDocument,
  deleteDocument,
  listExitRequests,
  createExitRequest,
  getExitRequest,
  updateExitRequest,
  updateChecklistTask
};
