import axios from '../axios';

export const listQuestions = async (params = {}) => {
  const response = await axios.get('/question-bank', { params });
  return response.data?.data || response.data || [];
};

export const createQuestion = async (data) => {
  const response = await axios.post('/question-bank', data);
  return response.data?.data || response.data;
};

export const getQuestion = async (id) => {
  const response = await axios.get(`/question-bank/${id}`);
  return response.data?.data || response.data;
};

export const deleteQuestion = async (id) => {
  const response = await axios.delete(`/question-bank/${id}`);
  return response.data?.data || response.data;
};

export const bulkImportQuestions = async (questions) => {
  const response = await axios.post('/question-bank/bulk-import', { questions });
  return response.data?.data || response.data;
};

export const questionBankApi = {
  list: listQuestions,
  create: createQuestion,
  getById: getQuestion,
  delete: deleteQuestion,
  bulkImport: bulkImportQuestions
};

export default questionBankApi;
