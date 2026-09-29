import axiosInstance from './api/axiosInstance.js';

// Unified API client export ensuring single interceptor and timeout configuration
const api = axiosInstance;

export default api;
