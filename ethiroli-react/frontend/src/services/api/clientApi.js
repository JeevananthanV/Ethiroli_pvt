import axiosInstance from './axiosInstance.js';

export const listClients = async (params) => {
  const response = await axiosInstance.get('/v1/clients', { params });
  return response.data;
};

export const getClient = async (id) => {
  const response = await axiosInstance.get(`/v1/clients/${id}`);
  return response.data;
};

export const createClient = async (data) => {
  const response = await axiosInstance.post('/v1/clients', data);
  return response.data;
};

export const updateClient = async (id, data) => {
  const response = await axiosInstance.patch(`/v1/clients/${id}`, data);
  return response.data;
};

export const deleteClient = async (id) => {
  const response = await axiosInstance.delete(`/v1/clients/${id}`);
  return response.data;
};
