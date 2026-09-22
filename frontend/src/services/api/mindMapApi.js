import axiosInstance from './axiosInstance.js';

export const getMindMapNodes = async (params) => {
  const response = await axiosInstance.get('/v1/mindmap/nodes', { params });
  return response.data;
};

export const createMindMapNode = async (nodeData) => {
  const response = await axiosInstance.post('/v1/mindmap/nodes', nodeData);
  return response.data;
};

export const updateMindMapNode = async (id, nodeData) => {
  const response = await axiosInstance.put(`/v1/mindmap/nodes/${id}`, nodeData);
  return response.data;
};

export const deleteMindMapNode = async (id) => {
  const response = await axiosInstance.delete(`/v1/mindmap/nodes/${id}`);
  return response.data;
};
