import axiosInstance from './axiosInstance.js';

export const getTutorProfile = async () => {
  const response = await axiosInstance.get('/v1/tutor/profile');
  return response.data;
};

export const updateTutorProfile = async (profileData) => {
  const response = await axiosInstance.patch('/v1/tutor/profile', profileData);
  return response.data;
};

export const changeTutorPassword = async (currentPassword, newPassword, confirmPassword) => {
  const response = await axiosInstance.put('/v1/tutor/credentials/password', {
    currentPassword,
    newPassword,
    confirmPassword
  });
  return response.data;
};

export const getTutorMetrics = async () => {
  const response = await axiosInstance.get('/v1/tutor/metrics');
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await axiosInstance.get('/v1/tutor/dashboard-stats');
  return response.data;
};

export const createLiveSession = async (sessionData) => {
  const response = await axiosInstance.post('/v1/tutor/live-sessions', sessionData);
  return response.data;
};

export const takeStudentRiskAction = async (actionData) => {
  const response = await axiosInstance.post('/v1/tutor/students-at-risk/action', actionData);
  return response.data;
};

export const getQuizAttempts = async (params) => {
  const response = await axiosInstance.get('/v1/tutor/quiz-attempts', { params });
  return response.data;
};

export const pushHRHandshake = async (payload) => {
  const response = await axiosInstance.post('/v1/tutor/certificate-handshake', payload);
  return response.data;
};

export const tutorApi = {
  getTutorProfile,
  updateTutorProfile,
  changeTutorPassword,
  getTutorMetrics,
  getDashboardStats,
  createLiveSession,
  takeStudentRiskAction,
  getQuizAttempts,
  pushHRHandshake,
};

export default tutorApi;
