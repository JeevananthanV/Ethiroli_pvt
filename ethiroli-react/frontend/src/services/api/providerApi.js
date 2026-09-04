import axiosInstance from './axiosInstance.js';

export const getProviders = async () => {
  const response = await axiosInstance.get('/v1/communication/providers');
  return response.data;
};

export const saveProvider = async (providerData) => {
  const response = await axiosInstance.post('/v1/communication/providers', providerData);
  return response.data;
};
