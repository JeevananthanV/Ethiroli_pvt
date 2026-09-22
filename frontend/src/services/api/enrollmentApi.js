import axiosInstance from './axiosInstance.js';

export const getEnrollments = async () => {
  const response = await axiosInstance.get('/v1/enrollments');
  return response.data;
};

export const listEnrollments = getEnrollments;

export const enrollStudent = async (data) => {
  const response = await axiosInstance.post('/v1/enrollments', data);
  return response.data;
};

export const getMyEnrollments = async () => {
  const response = await axiosInstance.get('/v1/enrollments/me');
  return response.data;
};

export const updateProgress = async (id, progress) => {
  const response = await axiosInstance.put(`/v1/enrollments/${id}/progress`, { progress });
  return response.data;
};

export const enrollmentApi = {
  getEnrollments,
  listEnrollments,
  enrollStudent,
  getMyEnrollments,
  updateProgress,
};
