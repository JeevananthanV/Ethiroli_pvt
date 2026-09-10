import axiosInstance from './axiosInstance.js';

export const getMarketplaceProducts = async () => {
  const response = await axiosInstance.get('/v1/marketplace/products');
  return response.data;
};

export const publishProduct = async (data) => {
  const response = await axiosInstance.post('/v1/marketplace/products', data);
  return response.data;
};
