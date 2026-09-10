import axiosInstance from './axiosInstance.js';

export const getTemplates = async () => {
  const response = await axiosInstance.get('/v1/templates');
  return response.data;
};

export const listTemplates = getTemplates;

export const createTemplate = async (data) => {
  const response = await axiosInstance.post('/v1/templates', data);
  return response.data;
};

export const templateApi = {
  getAll: getTemplates,
  list: listTemplates,
  create: createTemplate,
};
