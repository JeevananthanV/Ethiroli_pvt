import axiosInstance from './axiosInstance.js';

export const getProviders = async () => {
  const response = await axiosInstance.get('/v1/communication/providers');
  return response.data;
};

export const listProviders = getProviders;

export const saveProvider = async (data) => {
  const response = await axiosInstance.post('/v1/communication/providers', data);
  return response.data;
};

export const providerApi = {
  getAll: getProviders,
  list: listProviders,
  save: saveProvider,
};
