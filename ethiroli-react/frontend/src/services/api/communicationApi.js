import axiosInstance from './axiosInstance.js';

export const listLogs = async (params) => {
  const response = await axiosInstance.get('/v1/communication/logs', { params });
  return response.data;
};

export const sendMessage = async (data) => {
  const response = await axiosInstance.post('/v1/communication/send', data);
  return response.data;
};

export const sendBulkMessages = async (data) => {
  const response = await axiosInstance.post('/v1/communication/send/bulk', data);
  return response.data;
};
