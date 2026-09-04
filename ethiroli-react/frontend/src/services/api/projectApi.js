import axiosInstance from './axiosInstance.js';

export const listProjects = async (params) => {
  const response = await axiosInstance.get('/v1/student-projects/projects', { params });
  return response.data;
};

export const getProject = async (id) => {
  const response = await axiosInstance.get(`/v1/student-projects/projects/${id}`);
  return response.data;
};

export const createProject = async (data) => {
  const response = await axiosInstance.post('/v1/student-projects/projects', data);
  return response.data;
};

export const updateProject = async (id, data) => {
  const response = await axiosInstance.patch(`/v1/student-projects/projects/${id}`, data);
  return response.data;
};

export const linkRepository = async (data) => {
  const response = await axiosInstance.post('/v1/student-projects/projects', data);
  return response.data;
};
