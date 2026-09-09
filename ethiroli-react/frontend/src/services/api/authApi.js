import axiosInstance from './axiosInstance.js';

export const login = async (email, password, portal = null) => {
  const payload = { email, password };
  if (portal) {
    payload.portal = portal;
  }
  const response = await axiosInstance.post('/v1/auth/login', payload);
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
