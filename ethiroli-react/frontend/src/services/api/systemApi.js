import axiosInstance from './axiosInstance.js';

export const getHealth = async () => {
  const response = await axiosInstance.get('/v1/system/health');
  return response.data;
};

export const updateConfigs = async (configs) => {
  const response = await axiosInstance.put('/v1/system/configs', configs);
  return response.data;
};
