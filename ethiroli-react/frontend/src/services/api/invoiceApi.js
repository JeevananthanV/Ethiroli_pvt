import axiosInstance from './axiosInstance.js';

export const getInvoices = async (params) => {
  const response = await axiosInstance.get('/v1/invoices', { params });
  return response.data;
};

export const listInvoices = getInvoices;

export const getInvoice = async (id) => {
  const response = await axiosInstance.get(`/v1/invoices/${id}`);
  return response.data;
};

export const createInvoice = async (invoiceData) => {
  const response = await axiosInstance.post('/v1/invoices', invoiceData);
  return response.data;
};

export const updateInvoice = async (id, invoiceData) => {
  const response = await axiosInstance.put(`/v1/invoices/${id}`, invoiceData);
  return response.data;
};

export const deleteInvoice = async (id) => {
  const response = await axiosInstance.delete(`/v1/invoices/${id}`);
  return response.data;
};

export const generateInvoiceFromSubscription = async (subscriptionId) => {
  const response = await axiosInstance.post(`/v1/invoices/from-subscription/${subscriptionId}`);
  return response.data;
};

export const updateInvoiceStatus = async (id, status) => {
  return updateInvoice(id, typeof status === 'string' ? { status } : status);
};

export const generateInvoice = async (data) => {
  return createInvoice(data);
};

export const invoiceApi = {
  getAll: getInvoices,
  list: listInvoices,
  getById: getInvoice,
  create: createInvoice,
  update: updateInvoice,
  delete: deleteInvoice,
  generateFromSubscription: generateInvoiceFromSubscription,
  updateInvoiceStatus,
  generateInvoice,
};

export default invoiceApi;
