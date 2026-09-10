import axios from '../axios'

export const followUpApi = {
  getByLeadId: async (leadId) => {
    const response = await axios.get(`/follow-ups/lead/${leadId}`)
    return response.data
  },

  getById: async (id) => {
    const response = await axios.get(`/follow-ups/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await axios.post('/follow-ups', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await axios.put(`/follow-ups/${id}`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await axios.delete(`/follow-ups/${id}`)
    return response.data
  },
}
