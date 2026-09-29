import axiosInstance from './axiosInstance.js';

const unwrap = (response) => response?.data ?? null;

/** Certificates for the signed-in user (staff may pass ?student_id=). */
export const getCertificates = async (params) => {
  const response = await axiosInstance.get('/v1/certificates', { params });
  return unwrap(response);
};

export const listCertificates = getCertificates;

/** Full certificate payload including learner + course identity. */
export const getCertificate = async (id) => {
  const response = await axiosInstance.get(`/v1/certificates/${id}`);
  return unwrap(response);
};

/**
 * Everything needed to render and print the certificate, plus the public
 * verification URL that can be shared.
 */
export const downloadCertificate = async (id) => {
  const response = await axiosInstance.get(`/v1/certificates/${id}/download`);
  return unwrap(response);
};

/** Public certificate registry lookup - no session required. */
export const verifyCertificate = async (code) => {
  const response = await axiosInstance.get(`/v1/certificates/verify/${code}`);
  return unwrap(response);
};

export const generateCertificate = async (data) => {
  const response = await axiosInstance.post('/v1/certificates/generate', data);
  return unwrap(response);
};

export const certificateApi = {
  getCertificates,
  listCertificates,
  getCertificate,
  downloadCertificate,
  verify: verifyCertificate,
  generateCertificate
};

export default certificateApi;
