import axiosInstance from './axiosInstance.js';

export const listProducts = async (params) => {
  const response = await axiosInstance.get('/v1/marketplace/products', { params });
  return response.data;
};

export const getProduct = async (id) => {
  const response = await axiosInstance.get(`/v1/marketplace/products/${id}`);
  return response.data;
};

export const publishProduct = async (data) => {
  const response = await axiosInstance.post('/v1/marketplace/products', data);
  return response.data;
};

export const updateProduct = async (id, data) => {
  const response = await axiosInstance.patch(`/v1/marketplace/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await axiosInstance.delete(`/v1/marketplace/products/${id}`);
  return response.data;
};
