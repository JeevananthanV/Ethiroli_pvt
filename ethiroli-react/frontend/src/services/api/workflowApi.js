import axiosInstance from './axiosInstance.js';

export const getWorkflows = async (params) => {
  const response = await axiosInstance.get('/v1/workflows', { params });
  return response.data;
};

export const createWorkflow = async (data) => {
  const response = await axiosInstance.post('/v1/workflows', data);
  return response.data;
};

export const updateWorkflow = async (id, data) => {
  const response = await axiosInstance.patch(`/v1/workflows/${id}`, data);
  return response.data;
};

export const deleteWorkflow = async (id) => {
  const response = await axiosInstance.delete(`/v1/workflows/${id}`);
  return response.data;
};

export const getWorkflowExecutions = async (id, params) => {
  const response = await axiosInstance.get(`/v1/workflows/${id}/executions`, { params });
  return response.data;
};
