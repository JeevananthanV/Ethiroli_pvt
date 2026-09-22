import axiosInstance from './axiosInstance.js';

export const getContactMessages = async () => {
  const response = await axiosInstance.get('/v1/contact-messages');
  return response.data?.data || response.data || [];
};

export const getContactMessage = async (id) => {
  const response = await axiosInstance.get(`/v1/contact-messages/${id}`);
  return response.data?.data || response.data;
};

export const deleteContactMessage = async (id) => {
  const response = await axiosInstance.delete(`/v1/contact-messages/${id}`);
  return response.data;
};

export const submitContactMessage = async (data) => {
  const response = await axiosInstance.post('/v1/contact-messages', data);
  return response.data;
};
