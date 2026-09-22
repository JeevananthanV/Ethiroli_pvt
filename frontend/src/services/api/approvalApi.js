import axiosInstance from './axiosInstance.js';

export const getPendingApprovals = async () => {
  const response = await axiosInstance.get('/v1/approvals/pending');
  return response.data;
};

export const createApprovalInstance = async (data) => {
  const response = await axiosInstance.post('/v1/approvals', data);
  return response.data;
};

export const getWorkflows = async () => {
  const response = await axiosInstance.get('/v1/approvals/workflows');
  return response.data;
};

export const createWorkflow = async (data) => {
  const response = await axiosInstance.post('/v1/approvals/workflows', data);
  return response.data;
};
