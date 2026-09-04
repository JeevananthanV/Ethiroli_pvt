import axiosInstance from './axiosInstance.js';

export const listTasks = async (params) => {
  const response = await axiosInstance.get('/v1/tasks', { params });
  return response.data;
};

export const getTask = async (id) => {
  const response = await axiosInstance.get(`/v1/tasks/${id}`);
  return response.data;
};

export const createTask = async (data) => {
  const response = await axiosInstance.post('/v1/tasks', data);
  return response.data;
};

export const updateTaskStatus = async (id, status) => {
  const response = await axiosInstance.patch(`/v1/tasks/${id}/status`, { status });
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await axiosInstance.delete(`/v1/tasks/${id}`);
  return response.data;
};
