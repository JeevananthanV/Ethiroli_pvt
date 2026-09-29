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
