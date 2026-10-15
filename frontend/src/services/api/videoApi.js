import axios from 'axios';

// Base API URL - will be configured per environment
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const videoApi = {
  // Task APIs
  getTasks: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.assigned_editor) params.append('assigned_editor', filters.assigned_editor);
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    
    const response = await api.get(`/video/tasks?${params.toString()}`);
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await api.post('/video/tasks', taskData);
    return response.data;
  },

  updateTask: async (id, taskData) => {
    const response = await api.put(`/video/tasks/${id}`, taskData);
    return response.data;
  },

  deleteTask: async (id) => {
    const response = await api.delete(`/video/tasks/${id}`);
    return response.data;
  },

  // Work Log APIs
  getLogs: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.editor) params.append('editor', filters.editor);
    if (filters.task_id) params.append('task_id', filters.task_id);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    
    const response = await api.get(`/video/work-logs?${params.toString()}`);
    return response.data;
  },

  createLog: async (logData) => {
    const response = await api.post('/video/work-logs', logData);
    return response.data;
  },

  // Review APIs
  getReviews: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.task_id) params.append('task_id', filters.task_id);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    
    const response = await api.get(`/video/reviews?${params.toString()}`);
    return response.data;
  },

  createReview: async (reviewData) => {
    const response = await api.post('/video/reviews', reviewData);
    return response.data;
  },

  // Revision APIs
  getRevisions: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.task_id) params.append('task_id', filters.task_id);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    
    const response = await api.get(`/video/revisions?${params.toString()}`);
    return response.data;
  },

  createRevision: async (revisionData) => {
    const response = await api.post('/video/revisions', revisionData);
    return response.data;
  },

  // Delivery APIs
  getDeliveries: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.task_id) params.append('task_id', filters.task_id);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    
    const response = await api.get(`/video/deliveries?${params.toString()}`);
    return response.data;
  },

  markDelivered: async (id, deliveryData) => {
    const response = await api.put(`/video/deliveries/${id}`, deliveryData);
    return response.data;
  },

  // Project APIs
  getProjects: async () => {
    const response = await api.get('/video/projects');
    return response.data;
  },

  createProject: async (projectData) => {
    const response = await api.post('/video/projects', projectData);
    return response.data;
  },
};

export default videoApi;