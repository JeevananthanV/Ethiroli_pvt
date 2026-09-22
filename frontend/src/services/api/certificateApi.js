import axiosInstance from './axiosInstance.js';

export const getCertificates = async () => {
  const response = await axiosInstance.get('/v1/certificates');
  return response.data;
};

export const listCertificates = getCertificates;

export const generateCertificate = async (data) => {
  const response = await axiosInstance.post('/v1/certificates/generate', data);
  return response.data;
};

export const certificateApi = {
  getCertificates,
  listCertificates,
  generateCertificate,
};

export default certificateApi;
