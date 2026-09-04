import axiosInstance from './axiosInstance.js';

export const getLeads = async (params) => {
  const response = await axiosInstance.get('/v1/leads', { params });
  return response.data;
};

export const createLead = async (leadData) => {
  const response = await axiosInstance.post('/v1/leads', leadData);
  return response.data;
};

export const updateLeadStatus = async (id, status, lost_reason = null) => {
  const response = await axiosInstance.patch(`/v1/leads/${id}/status`, { status, lost_reason });
  return response.data;
};

export const updateLead = async (id, leadData) => {
  const response = await axiosInstance.patch(`/v1/leads/${id}`, leadData);
  return response.data;
};

export const deleteLead = async (id) => {
  const response = await axiosInstance.delete(`/v1/leads/${id}`);
  return response.data;
};

export const sendFollowUp = async (id, message) => {
  const response = await axiosInstance.post(`/v1/leads/${id}/follow-up`, { message });
  return response.data;
};
