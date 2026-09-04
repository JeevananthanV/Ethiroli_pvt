import axiosInstance from './axiosInstance.js';

export const login = async (email, password) => {
  const response = await axiosInstance.post('/v1/auth/login', { email, password });
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post('/v1/auth/logout');
  return response.data;
};

export const getMe = async () => {
  const response = await axiosInstance.get('/v1/auth/me');
  return response.data;
};
