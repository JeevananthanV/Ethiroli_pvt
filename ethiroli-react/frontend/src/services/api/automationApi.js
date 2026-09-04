import axiosInstance from './axiosInstance.js';

export const getAutomationWorkflows = async (params) => {
  const response = await axiosInstance.get('/v1/automation/workflows', { params });
  return response.data;
};

export const createAutomationWorkflow = async (workflowData) => {
  const response = await axiosInstance.post('/v1/automation/workflows', workflowData);
  return response.data;
};
