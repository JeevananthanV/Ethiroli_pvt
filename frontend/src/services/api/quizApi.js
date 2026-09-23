import axios from '../axios';

export const listQuizzes = async (params = {}) => {
  const response = await axios.get('/quizzes', { params });
  return response.data?.data || response.data || [];
};

export const getQuizzes = listQuizzes;

export const createQuiz = async (data) => {
  const response = await axios.post('/quizzes', data);
  return response.data?.data || response.data;
};

export const getQuiz = async (id) => {
  const response = await axios.get(`/quizzes/${id}`);
  return response.data?.data || response.data;
};

export const getQuizForTake = async (id) => {
  const response = await axios.get(`/quizzes/${id}/take`);
  return response.data?.data || response.data;
};

export const submitQuiz = async (id, answersPayload) => {
  const payload = typeof answersPayload === 'object' && !answersPayload.answers
    ? { answers: answersPayload }
    : answersPayload;
  const response = await axios.post(`/quizzes/${id}/submit`, payload);
  return response.data?.data || response.data;
};

export const getQuizResults = async (id) => {
  const response = await axios.get(`/quizzes/${id}/results`);
  return response.data?.data || response.data || [];
};

export const updateQuiz = async (id, data) => {
  const response = await axios.patch(`/quizzes/${id}`, data);
  return response.data?.data || response.data;
};

export const deleteQuiz = async (id) => {
  const response = await axios.delete(`/quizzes/${id}`);
  return response.data?.data || response.data;
};

export const publishQuiz = async (id) => {
  const response = await axios.patch(`/quizzes/${id}/publish`);
  return response.data?.data || response.data;
};

export const unpublishQuiz = async (id) => {
  const response = await axios.patch(`/quizzes/${id}/unpublish`);
  return response.data?.data || response.data;
};

export const attachQuestionsToQuiz = async (id, question_ids) => {
  const response = await axios.post(`/quizzes/${id}/questions`, { question_ids });
  return response.data?.data || response.data;
};

export const detachQuestionFromQuiz = async (id, questionId) => {
  const response = await axios.delete(`/quizzes/${id}/questions/${questionId}`);
  return response.data?.data || response.data;
};

export const quizApi = {
  getAll: getQuizzes,
  list: listQuizzes,
  getById: getQuiz,
  getForTake: getQuizForTake,
  create: createQuiz,
  update: updateQuiz,
  delete: deleteQuiz,
  publish: publishQuiz,
  unpublish: unpublishQuiz,
  submit: submitQuiz,
  getResults: getQuizResults,
  attachQuestions: attachQuestionsToQuiz,
  detachQuestion: detachQuestionFromQuiz
};

export default quizApi;
