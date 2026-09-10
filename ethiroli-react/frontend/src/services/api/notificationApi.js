import axiosInstance from './axiosInstance.js';

export const registerDevice = async (data) => {
  const response = await axiosInstance.post('/v1/notifications/devices', data);
  return response.data;
};
