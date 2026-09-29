import axiosInstance from './axiosInstance.js';

export const getUsers = async (params) => {
  const response = await axiosInstance.get('/v1/users', { params });
  return response.data;
};

export const getUser = async (id) => {
  const response = await axiosInstance.get(`/v1/users/${id}`);
  return response.data;
};

/** PATCH /v1/users/me - self-service profile update (name / phone only). */
export const updateMyProfile = async (profileData) => {
  const response = await axiosInstance.patch('/v1/users/me', profileData);
  return response.data;
};

export const createUser = async (userData) => {
  const response = await axiosInstance.post('/v1/users', userData);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await axiosInstance.put(`/v1/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await axiosInstance.delete(`/v1/users/${id}`);
  return response.data;
};

export const getUserFilters = async () => {
  const response = await axiosInstance.get('/v1/users/filters');
  return response.data;
};

export const updateUserStatus = async (id, status) => {
  const response = await axiosInstance.patch(`/v1/users/${id}/status`, { status });
  return response.data;
};

export const assignUserRole = async (id, role) => {
  const response = await axiosInstance.patch(`/v1/users/${id}/role`, { role });
  return response.data;
};

export const resetUserPassword = async (id, newPassword, requiresPasswordChange = false) => {
  const response = await axiosInstance.post(`/v1/users/${id}/reset-password`, { newPassword, requiresPasswordChange });
  return response.data;
};

export const rotateUserCredentials = async (id, temporaryPassword = null) => {
  const response = await axiosInstance.post(`/v1/users/${id}/rotate-credentials`, { temporaryPassword });
  return response.data;
};

