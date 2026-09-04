import axiosInstance from './axiosInstance.js';

export const listInvoices = async (params) => {
  const response = await axiosInstance.get('/v1/invoices', { params });
  return response.data;
};

export const getInvoice = async (id) => {
  const response = await axiosInstance.get(`/v1/invoices/${id}`);
  return response.data;
};

export const generateInvoice = async (data) => {
  const response = await axiosInstance.post('/v1/invoices', data);
  return response.data;
};

export const batchGenerateInvoices = async (data) => {
  const response = await axiosInstance.post('/v1/invoices/batch', data);
  return response.data;
};

export const updateInvoiceStatus = async (id, status) => {
  const response = await axiosInstance.patch(`/v1/invoices/${id}/status`, { status });
  return response.data;
};
