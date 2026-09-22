import axiosInstance from './axiosInstance.js';

export const getPublicCourses = async (params) => {
  const response = await axiosInstance.get('/v1/public/courses', { params });
  return response.data;
};

export const getPublicCourseDetail = async (id) => {
  const response = await axiosInstance.get(`/v1/public/courses/${id}`);
  return response.data;
};

export const getPublicProducts = async (params) => {
  const response = await axiosInstance.get('/v1/public/products', { params });
  return response.data;
};

export const submitPublicInquiry = async (data) => {
  const response = await axiosInstance.post('/v1/public/inquiries', data);
  return response.data;
};
