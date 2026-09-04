import axiosInstance from './axiosInstance.js';

export const getTemplates = async () => {
  const response = await axiosInstance.get('/v1/communication/templates');
  return response.data;
};

export const createTemplate = async (templateData) => {
  const response = await axiosInstance.post('/v1/communication/templates', templateData);
  return response.data;
};
