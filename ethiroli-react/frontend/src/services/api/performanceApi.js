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

export const performanceApi = {
  getPerformanceReviews,
  listReviews,
  createPerformanceReview,
  createReview,
};
