import axiosInstance from './axiosInstance.js';

export const getCompanySettings = async () => {
  const response = await axiosInstance.get('/v1/company/settings');
  return response.data;
};

export const updateCompanySettings = async (settings) => {
  const response = await axiosInstance.put('/v1/company/settings', settings);
  return response.data;
};

export const uploadCompanyLogo = async (file) => {
  const formData = new FormData();
  formData.append('logo', file);
  const response = await axiosInstance.post('/v1/company/logo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};
