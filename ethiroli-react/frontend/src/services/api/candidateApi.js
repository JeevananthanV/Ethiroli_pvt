import axiosInstance from './axiosInstance.js';

export const getCandidates = async (params) => {
  const response = await axiosInstance.get('/v1/candidates', { params });
  return response.data;
};

export const createCandidate = async (candidateData) => {
  const response = await axiosInstance.post('/v1/candidates', candidateData);
  return response.data;
};
