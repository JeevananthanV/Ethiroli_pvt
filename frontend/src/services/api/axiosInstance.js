import axios from 'axios';

const rawBase = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_BASE_URL = rawBase.endsWith('/api') ? rawBase : (rawBase.endsWith('/') ? `${rawBase}api` : `${rawBase}/api`);

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data || {};

    // Handle 401 - Unauthenticated: clear auth and redirect to login
    if (status === 401) {
      const url = new URL(window.location.href);
      const isAuthEndpoint = url.pathname.startsWith('/auth/');

      if (!isAuthEndpoint) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('active_role');
        window.location.href = '/auth/login';
      }

      return Promise.reject(error);
    }

    // Handle 403 - Forbidden: log warning and let caller or PrivateRoute handle gracefully
    if (status === 403) {
      console.warn('Access forbidden (403):', error.config?.url, data.message || 'Permission denied');
      return Promise.reject(error);
    }

    // Handle 422 - Unprocessable Entity: validation errors
    if (status === 422) {
      console.warn('Validation error (422):', data.message || error.message);
      return Promise.reject(error);
    }

    // Handle 500+ - Server errors
    if (status >= 500) {
      console.error('Server error (500+):', error.config?.url, data.message || error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
