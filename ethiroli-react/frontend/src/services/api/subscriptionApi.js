import axiosInstance from './axiosInstance.js';

export const getSubscriptions = async (params) => {
  const response = await axiosInstance.get('/v1/subscriptions', { params });
  return response.data;
};

export const listSubscriptions = getSubscriptions;

export const getSubscription = async (id) => {
  const response = await axiosInstance.get(`/v1/subscriptions/${id}`);
  return response.data;
};

export const createSubscription = async (subscriptionData) => {
  const response = await axiosInstance.post('/v1/subscriptions', subscriptionData);
  return response.data;
};

export const updateSubscription = async (id, subscriptionData) => {
  const response = await axiosInstance.put(`/v1/subscriptions/${id}`, subscriptionData);
  return response.data;
};

export const cancelSubscription = async (id) => {
  const response = await axiosInstance.patch(`/v1/subscriptions/${id}/cancel`);
  return response.data;
};

export const getSubscriptionPlans = async () => {
  const response = await axiosInstance.get('/v1/subscriptions/plans');
  return response.data;
};

export const subscriptionApi = {
  getSubscriptions,
  listSubscriptions,
  getSubscription,
  createSubscription,
  updateSubscription,
  cancelSubscription,
  getSubscriptionPlans,
};
