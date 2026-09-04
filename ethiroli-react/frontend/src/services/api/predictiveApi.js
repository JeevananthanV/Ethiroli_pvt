import axiosInstance from './axiosInstance.js';

export const getLeadScore = async (leadId) => {
  const response = await axiosInstance.get(`/v1/predict/leads/${leadId}/score`);
  return response.data;
};

export const getStudentChurn = async (studentId) => {
  const response = await axiosInstance.get(`/v1/predict/students/${studentId}/churn`);
  return response.data;
};
