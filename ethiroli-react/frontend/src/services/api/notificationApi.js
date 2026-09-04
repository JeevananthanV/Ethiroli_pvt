import axiosInstance from './axiosInstance.js';

export const registerDevice = async (deviceData) => {
  const response = await axiosInstance.post('/v1/notifications/devices', deviceData);
  return response.data;
};
