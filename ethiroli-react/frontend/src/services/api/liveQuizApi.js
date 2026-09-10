import axios from '../axios'

export const liveQuizApi = {
  getAll: async () => {
    const response = await axios.get('/live-quizzes')
    return response.data
  },

  getById: async (id) => {
    const response = await axios.get(`/live-quizzes/${id}`)
    return response.data
  },

  start: async (id) => {
    const response = await axios.post(`/live-quizzes/${id}/start`)
    return response.data
  },

  submitAnswer: async (id, answer) => {
    const response = await axios.post(`/live-quizzes/${id}/answer`, { answer })
    return response.data
  },

  getLeaderboard: async (id) => {
    const response = await axios.get(`/live-quizzes/${id}/leaderboard`)
    return response.data
  },

  end: async (id) => {
    const response = await axios.post(`/live-quizzes/${id}/end`)
    return response.data
  },
}
