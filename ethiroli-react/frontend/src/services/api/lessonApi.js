import axiosInstance from './axiosInstance.js';

export const getLessons = async (moduleId, params) => {
  const response = await axiosInstance.get(`/v1/modules/${moduleId}/lessons`, { params });
  return response.data;
};

export const createLesson = async (moduleId, lessonData) => {
  const response = await axiosInstance.post(`/v1/modules/${moduleId}/lessons`, lessonData);
  return response.data;
};

export const updateLesson = async (id, lessonData) => {
  const response = await axiosInstance.patch(`/v1/lessons/${id}`, lessonData);
  return response.data;
};

export const deleteLesson = async (id) => {
  const response = await axiosInstance.delete(`/v1/lessons/${id}`);
  return response.data;
};
