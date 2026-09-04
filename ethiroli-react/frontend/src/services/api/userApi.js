import axiosInstance from './axiosInstance.js';

export const getUsers = async (params) => {
  const response = await axiosInstance.get('/v1/users', { params });
  return response.data;
};

export const createUser = async (userData) => {
  const response = await axiosInstance.post('/v1/users', userData);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await axiosInstance.patch(`/v1/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await axiosInstance.delete(`/v1/users/${id}`);
  return response.data;
};
