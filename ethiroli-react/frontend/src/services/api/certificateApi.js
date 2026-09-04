import axiosInstance from './axiosInstance.js';

export const listCertificates = async (params) => {
  const response = await axiosInstance.get('/v1/certificates', { params });
  return response.data;
};

export const getCertificate = async (id) => {
  const response = await axiosInstance.get(`/v1/certificates/${id}`);
  return response.data;
};

export const generateCertificate = async (data) => {
  const response = await axiosInstance.post('/v1/certificates/generate', data);
  return response.data;
};

export const deleteCertificate = async (id) => {
  const response = await axiosInstance.delete(`/v1/certificates/${id}`);
  return response.data;
};
