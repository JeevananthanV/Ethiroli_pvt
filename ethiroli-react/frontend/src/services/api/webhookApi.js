import axiosInstance from './axiosInstance.js';

export const webhookApi = {
  getAll: async () => {
    const response = await axiosInstance.get('/v1/webhooks');
    return response?.data || response;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/v1/webhooks/${id}`);
    return response?.data || response;
  },

  create: async (data) => {
    const response = await axiosInstance.post('/v1/webhooks', data);
    return response?.data || response;
  },

  update: async (id, data) => {
    const response = await axiosInstance.patch(`/v1/webhooks/${id}`, data);
    return response?.data || response;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/v1/webhooks/${id}`);
    return response?.data || response;
  },

  test: async (id) => {
    const response = await axiosInstance.post(`/v1/webhooks/${id}/test`);
    return response?.data || response;
  },

  simulateIndeedApplication: async (payload = {}) => {
    const response = await axiosInstance.post('/v1/jobs-board/indeed/simulate-application', payload);
    return response?.data || response;
  }
};

export default webhookApi;
