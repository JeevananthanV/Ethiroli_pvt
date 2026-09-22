import axiosInstance from './axiosInstance.js';

export const getCareerApplications = async () => {
  const response = await axiosInstance.get('/v1/candidates/applications');
  return response.data?.data || response.data || [];
};

export const getCandidates = async (params = {}) => {
  const response = await axiosInstance.get('/v1/candidates', { params });
  return response.data?.data || response.data || [];
};

export const updateCandidateStatus = async (id, status) => {
  const response = await axiosInstance.patch(`/v1/candidates/${id}`, { status });
  return response.data;
};

export const deleteCandidate = async (id) => {
  const response = await axiosInstance.delete(`/v1/candidates/${id}`);
  return response.data;
};

export const deleteCareerApplication = async (id) => {
  const response = await axiosInstance.delete(`/v1/candidates/applications/${id}`);
  return response.data;
};

export const submitCareerApplication = async (data) => {
  const response = await axiosInstance.post('/v1/candidates', data);
  return response.data;
};
