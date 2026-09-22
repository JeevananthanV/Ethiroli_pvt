import axiosInstance from './axiosInstance.js';

export const getLeaves = async (params = {}) => {
  const response = await axiosInstance.get('/v1/leaves', { params });
  return response.data;
};

export const getLeave = async (id) => {
  const response = await axiosInstance.get(`/v1/leaves/${id}`);
  return response.data;
};

export const createLeave = async (data) => {
  const response = await axiosInstance.post('/v1/leaves', data);
  return response.data;
};

export const updateLeave = async (id, data) => {
  const response = await axiosInstance.patch(`/v1/leaves/${id}`, data);
  return response.data;
};

export const deleteLeave = async (id) => {
  const response = await axiosInstance.delete(`/v1/leaves/${id}`);
  return response.data;
};

export const updateLeaveStatus = async (id, status) => {
  const response = await axiosInstance.patch(`/v1/leaves/${id}/status`, { status });
  return response.data;
};

export const approveLeave = async (id) => {
  return updateLeaveStatus(id, 'APPROVED');
};

export const rejectLeave = async (id) => {
  return updateLeaveStatus(id, 'REJECTED');
};

export const listLeaves = getLeaves;

export const leaveApi = {
  getAll: getLeaves,
  getById: getLeave,
  create: createLeave,
  update: updateLeave,
  delete: deleteLeave,
  updateStatus: updateLeaveStatus,
  approve: approveLeave,
  reject: rejectLeave,
};

export default leaveApi;