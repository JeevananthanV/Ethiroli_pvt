import axiosInstance from './axiosInstance.js';

export const listReviews = async (params) => {
  const response = await axiosInstance.get('/v1/performance/reviews', { params });
  return response.data;
};

export const createReview = async (data) => {
  const response = await axiosInstance.post('/v1/performance/reviews', data);
  return response.data;
};

export const getReview = async (id) => {
  const response = await axiosInstance.get(`/v1/performance/reviews/${id}`);
  return response.data;
};

export const updateReview = async (id, data) => {
  const response = await axiosInstance.patch(`/v1/performance/reviews/${id}`, data);
  return response.data;
};
