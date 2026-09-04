import axiosInstance from './axiosInstance.js';

export const getCompanySettings = async () => {
  const response = await axiosInstance.get('/v1/pms/settings/company');
  return response.data;
};

export const saveCompanySettings = async (settingsData) => {
  const response = await axiosInstance.put('/v1/pms/settings/company', settingsData);
  return response.data;
};
