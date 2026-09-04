import axiosInstance from './axiosInstance.js';

export const getMindMapNodes = async (params) => {
  const response = await axiosInstance.get('/v1/mindmap/nodes', { params });
  return response.data;
};

export const createMindMapNode = async (nodeData) => {
  const response = await axiosInstance.post('/v1/mindmap/nodes', nodeData);
  return response.data;
};
