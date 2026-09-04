import axiosInstance from './axiosInstance.js';

export const listSubscriptions = async (params) => {
  const response = await axiosInstance.get('/v1/subscriptions', { params });
  return response.data;
};

export const getSubscription = async (id) => {
  const response = await axiosInstance.get(`/v1/subscriptions/${id}`);
  return response.data;
};

export const createSubscription = async (data) => {
  const response = await axiosInstance.post('/v1/subscriptions', data);
  return response.data;
};

export const updateSubscription = async (id, data) => {
  const response = await axiosInstance.patch(`/v1/subscriptions/${id}`, data);
  return response.data;
};

export const deleteSubscription = async (id) => {
  const response = await axiosInstance.delete(`/v1/subscriptions/${id}`);
  return response.data;
};
