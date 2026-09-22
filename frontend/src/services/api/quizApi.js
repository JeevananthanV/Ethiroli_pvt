import axios from '../axios'

export const getQuizzes = async () => {
  const response = await axios.get('/quizzes')
  return response.data
}

export const listQuizzes = getQuizzes

export const getQuiz = async (id) => {
  const response = await axios.get(`/quizzes/${id}`)
  return response.data
}

export const submitQuiz = async (id, answers) => {
  const response = await axios.post(`/quizzes/${id}/submit`, { answers })
  return response.data
}

export const getQuizResults = async (id) => {
  const response = await axios.get(`/quizzes/${id}/results`)
  return response.data
}

export const quizApi = {
  getAll: getQuizzes,
  list: listQuizzes,
  getById: getQuiz,
  submit: submitQuiz,
  getResults: getQuizResults,
};
