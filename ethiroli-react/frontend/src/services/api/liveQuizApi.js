import axiosInstance from './axiosInstance.js';

export const getLiveQuizSessions = async (params) => {
  const response = await axiosInstance.get('/v1/live-quiz-sessions', { params });
  return response.data;
};

export const createLiveQuizSession = async (data) => {
  const response = await axiosInstance.post('/v1/live-quiz-sessions', data);
  return response.data;
};

export const joinLiveQuizSession = async (id) => {
  const response = await axiosInstance.post(`/v1/live-quiz-sessions/${id}/join`);
  return response.data;
};

export const submitLiveQuizAnswer = async (id, answer) => {
  const response = await axiosInstance.post(`/v1/live-quiz-sessions/${id}/answers`, answer);
  return response.data;
};

export const getLiveQuizLeaderboard = async (id) => {
  const response = await axiosInstance.get(`/v1/live-quiz-sessions/${id}/leaderboard`);
  return response.data;
};
