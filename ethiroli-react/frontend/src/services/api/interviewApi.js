import axiosInstance from './axiosInstance.js';

export const listInterviews = async (params) => {
  const response = await axiosInstance.get('/v1/interviews', { params });
  return response.data;
};

export const scheduleInterview = async (data) => {
  const response = await axiosInstance.post('/v1/interviews', data);
  return response.data;
};

export const getInterview = async (id) => {
  const response = await axiosInstance.get(`/v1/interviews/${id}`);
  return response.data;
};

export const updateInterview = async (id, data) => {
  const response = await axiosInstance.patch(`/v1/interviews/${id}`, data);
  return response.data;
};
