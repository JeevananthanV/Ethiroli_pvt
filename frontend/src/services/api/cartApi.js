import axiosInstance from './axiosInstance.js';

export const getCart = async () => {
  const response = await axiosInstance.get('/v1/cart');
  return response.data;
};

export const addToCart = async (item) => {
  const response = await axiosInstance.post('/v1/cart/items', item);
  return response.data;
};

export const updateCartItem = async (id, quantity) => {
  const response = await axiosInstance.patch(`/v1/cart/items/${id}`, { quantity });
  return response.data;
};

export const removeFromCart = async (id) => {
  const response = await axiosInstance.delete(`/v1/cart/items/${id}`);
  return response.data;
};

export const clearCart = async () => {
  const response = await axiosInstance.delete('/v1/cart');
  return response.data;
};
