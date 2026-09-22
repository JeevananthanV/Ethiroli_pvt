import axiosInstance from './axiosInstance.js';

export const registerDevice = async (data) => {
  const response = await axiosInstance.post('/v1/notifications/devices', data);
  return response?.data || response;
};

export const listDevices = async (params = {}) => {
  const response = await axiosInstance.get('/v1/notifications/devices', { params });
  return response?.data || response;
};

export const unregisterDevice = async (id) => {
  const response = await axiosInstance.delete(`/v1/notifications/devices/${id}`);
  return response?.data || response;
};

export const testPushNotification = async () => {
  const response = await axiosInstance.post('/v1/notifications/test');
  return response?.data || response;
};

export const sendCampaign = async (campaignData) => {
  const response = await axiosInstance.post('/v1/notifications/campaign', campaignData);
  return response?.data || response;
};

export const notificationApi = {
  registerDevice,
  listDevices,
  unregisterDevice,
  testPushNotification,
  sendCampaign
};

export default notificationApi;
