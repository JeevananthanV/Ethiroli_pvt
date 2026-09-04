import axiosInstance from './axiosInstance.js';

export const getJobs = async (params) => {
  const response = await axiosInstance.get('/v1/jobs', { params });
  return response.data;
};

export const createJob = async (jobData) => {
  const response = await axiosInstance.post('/v1/jobs', jobData);
  return response.data;
};
