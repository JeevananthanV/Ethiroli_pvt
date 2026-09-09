import axiosInstance from './axiosInstance.js';

export const getFollowUps = async (leadId) => {
  const response = await axiosInstance.get(`/v1/leads/${leadId}/follow-ups`);
  return response.data;
};

export const createFollowUp = async (leadId, data) => {
  const response = await axiosInstance.post(`/v1/leads/${leadId}/follow-ups`, data);
  return response.data;
};

export const updateFollowUp = async (leadId, followUpId, data) => {
  const response = await axiosInstance.patch(`/v1/leads/${leadId}/follow-ups/${followUpId}`, data);
  return response.data;
};

export const deleteFollowUp = async (leadId, followUpId) => {
  const response = await axiosInstance.delete(`/v1/leads/${leadId}/follow-ups/${followUpId}`);
  return response.data;
};
