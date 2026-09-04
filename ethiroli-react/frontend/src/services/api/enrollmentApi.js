import axiosInstance from './axiosInstance.js';

export const listEnrollments = async (courseId, params) => {
  const response = await axiosInstance.get(`/v1/courses/${courseId}/enrollments`, { params });
  return response.data;
};

export const enrollStudent = async (courseId, data) => {
  const response = await axiosInstance.post(`/v1/courses/${courseId}/enroll`, data);
  return response.data;
};

export const getMyEnrollments = async () => {
  const response = await axiosInstance.get('/v1/enrollments/me');
  return response.data;
};

export const updateProgress = async (enrollmentId, progress) => {
  const response = await axiosInstance.patch(`/v1/enrollments/${enrollmentId}/progress`, { progress });
  return response.data;
};
