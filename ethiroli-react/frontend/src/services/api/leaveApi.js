import axiosInstance from './axiosInstance.js';

export const listLeaves = async (params) => {
  const response = await axiosInstance.get('/v1/leaves', { params });
  return response.data;
};

export const applyLeave = async (data) => {
  const response = await axiosInstance.post('/v1/leaves', data);
  return response.data;
};

export const updateLeaveStatus = async (id, status) => {
  const response = await axiosInstance.patch(`/v1/leaves/${id}/status`, { status });
  return response.data;
};
