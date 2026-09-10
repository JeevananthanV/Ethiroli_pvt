import axios from '../axios'

export const webhookApi = {
  getAll: async () => {
    const response = await axios.get('/webhooks')
    return response.data
  },

  getById: async (id) => {
    const response = await axios.get(`/webhooks/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await axios.post('/webhooks', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await axios.put(`/webhooks/${id}`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await axios.delete(`/webhooks/${id}`)
    return response.data
  },

  test: async (id) => {
    const response = await axios.post(`/webhooks/${id}/test`)
    return response.data
  },

  getLogs: async (id) => {
    const response = await axios.get(`/webhooks/${id}/logs`)
    return response.data
  },
}
