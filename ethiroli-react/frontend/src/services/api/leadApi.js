import axios from '../axios'

export const getLeads = async () => {
  const response = await axios.get('/leads')
  return response.data
}

export const getLead = async (id) => {
  const response = await axios.get(`/leads/${id}`)
  return response.data
}

export const createLead = async (data) => {
  const response = await axios.post('/leads', data)
  return response.data
}

export const updateLead = async (id, data) => {
  const response = await axios.put(`/leads/${id}`, data)
  return response.data
}

export const deleteLead = async (id) => {
  const response = await axios.delete(`/leads/${id}`)
  return response.data
}

export const updateLeadStatus = async (id, status) => {
  const response = await axios.put(`/leads/${id}/status`, { status })
  return response.data
}

export const leadApi = {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  updateLeadStatus,
};
