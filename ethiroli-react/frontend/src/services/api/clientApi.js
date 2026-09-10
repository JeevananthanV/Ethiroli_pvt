import axiosInstance from './axiosInstance.js';

export const getClients = async (params) => {
  const response = await axiosInstance.get('/v1/clients', { params });
  return response.data;
};

export const listClients = getClients;

export const getClient = async (id) => {
  const response = await axiosInstance.get(`/v1/clients/${id}`);
  return response.data;
};

export const createClient = async (clientData) => {
  const response = await axiosInstance.post('/v1/clients', clientData);
  return response.data;
};

export const updateClient = async (id, clientData) => {
  const response = await axiosInstance.put(`/v1/clients/${id}`, clientData);
  return response.data;
};

export const deleteClient = async (id) => {
  const response = await axiosInstance.delete(`/v1/clients/${id}`);
  return response.data;
};

export const clientApi = {
  getAll: getClients,
  list: listClients,
  getById: getClient,
  create: createClient,
  update: updateClient,
  delete: deleteClient,
};
