import axiosInstance from './axiosInstance.js';

export const getTasks = async (params) => {
  const response = await axiosInstance.get('/v1/tasks', { params });
  return response.data;
};

export const listTasks = getTasks;

export const getTask = async (id) => {
  const response = await axiosInstance.get(`/v1/tasks/${id}`);
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await axiosInstance.post('/v1/tasks', taskData);
  return response.data;
};

export const updateTask = async (id, taskData) => {
  const response = await axiosInstance.put(`/v1/tasks/${id}`, taskData);
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await axiosInstance.delete(`/v1/tasks/${id}`);
  return response.data;
};

export const getTaskBoard = async (projectId) => {
  const response = await axiosInstance.get(`/v1/tasks/board/${projectId}`);
  return response.data;
};

export const moveTask = async (id, status) => {
  const response = await axiosInstance.patch(`/v1/tasks/${id}/move`, { status });
  return response.data;
};

export const taskApi = {
  getAll: getTasks,
  list: listTasks,
  getById: getTask,
  create: createTask,
  update: updateTask,
  delete: deleteTask,
  getTaskBoard,
  moveTask,
};
