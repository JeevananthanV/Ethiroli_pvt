import axiosInstance from './axiosInstance.js';

export const listCourses = async (params) => {
  const response = await axiosInstance.get('/v1/courses', { params });
  return response.data;
};

export const getCourse = async (id) => {
  const response = await axiosInstance.get(`/v1/courses/${id}`);
  return response.data;
};

export const createCourse = async (data) => {
  const response = await axiosInstance.post('/v1/courses', data);
  return response.data;
};

export const updateCourse = async (id, data) => {
  const response = await axiosInstance.patch(`/v1/courses/${id}`, data);
  return response.data;
};

export const deleteCourse = async (id) => {
  const response = await axiosInstance.delete(`/v1/courses/${id}`);
  return response.data;
};
