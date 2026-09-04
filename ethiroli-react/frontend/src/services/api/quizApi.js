import axiosInstance from './axiosInstance.js';

export const getQuizzes = async () => {
  const response = await axiosInstance.get('/v1/quizzes');
  return response.data;
};

export const createQuiz = async (quizData) => {
  const response = await axiosInstance.post('/v1/quizzes', quizData);
  return response.data;
};

export const getQuiz = async (id) => {
  const response = await axiosInstance.get(`/v1/quizzes/${id}`);
  return response.data;
};
