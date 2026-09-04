import axiosInstance from './axiosInstance.js';

export const listPayments = async (params) => {
  const response = await axiosInstance.get('/v1/payments', { params });
  return response.data;
};

export const getPayment = async (id) => {
  const response = await axiosInstance.get(`/v1/payments/${id}`);
  return response.data;
};

export const recordPayment = async (data) => {
  const response = await axiosInstance.post('/v1/payments', data);
  return response.data;
};
