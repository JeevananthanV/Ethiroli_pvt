import axiosInstance from './axiosInstance.js';

export const getModules = async (courseId, params) => {
  const response = await axiosInstance.get(`/v1/courses/${courseId}/modules`, { params });
  return response.data;
};

export const createModule = async (courseId, moduleData) => {
  const response = await axiosInstance.post(`/v1/courses/${courseId}/modules`, moduleData);
  return response.data;
};

export const updateModule = async (id, moduleData) => {
  const response = await axiosInstance.patch(`/v1/modules/${id}`, moduleData);
  return response.data;
};

export const deleteModule = async (id) => {
  const response = await axiosInstance.delete(`/v1/modules/${id}`);
  return response.data;
};
