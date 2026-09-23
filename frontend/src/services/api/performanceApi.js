import axiosInstance from './axiosInstance.js';

export const getPerformanceReviews = async () => {
  const response = await axiosInstance.get('/v1/performance-reviews');
  return response.data;
};

export const listReviews = getPerformanceReviews;

export const createPerformanceReview = async (data) => {
  const response = await axiosInstance.post('/v1/performance-reviews', data);
  return response.data;
};

export const createReview = createPerformanceReview;

export const updateReview = async (id, data) => {
  const response = await axiosInstance.patch(`/v1/performance/reviews/${id}`, data);
  return response.data;
};

export const deleteReview = async (id) => {
  const response = await axiosInstance.delete(`/v1/performance/reviews/${id}`);
  return response.data;
};

export const performanceApi = {
  getPerformanceReviews,
  listReviews,
  createPerformanceReview,
  createReview,
  updateReview,
  deleteReview,
};

export default performanceApi;
