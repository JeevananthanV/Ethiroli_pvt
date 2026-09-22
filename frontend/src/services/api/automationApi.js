import axios from '../axios'

export const automationApi = {
  getAll: async () => {
    const response = await axios.get('/automation')
    return response.data
  },

  getById: async (id) => {
    const response = await axios.get(`/automation/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await axios.post('/automation', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await axios.put(`/automation/${id}`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await axios.delete(`/automation/${id}`)
    return response.data
  },

  execute: async (id) => {
    const response = await axios.post(`/automation/${id}/execute`)
    return response.data
  },

  getExecutions: async (id) => {
    const response = await axios.get(`/automation/${id}/executions`)
    return response.data
  },
}
