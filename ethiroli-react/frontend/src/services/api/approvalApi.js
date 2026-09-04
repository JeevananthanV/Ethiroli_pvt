import axiosInstance from './axiosInstance.js';

export const getPendingApprovals = async () => {
  const response = await axiosInstance.get('/v1/approvals/pending');
  return response.data;
};

export const createApprovalInstance = async (approvalData) => {
  const response = await axiosInstance.post('/v1/approvals/instances', approvalData);
  return response.data;
};

export const getWorkflows = async () => {
  const response = await axiosInstance.get('/v1/approvals/workflows');
  return response.data;
};

export const createWorkflow = async (workflowData) => {
  const response = await axiosInstance.post('/v1/approvals/workflows', workflowData);
  return response.data;
};
