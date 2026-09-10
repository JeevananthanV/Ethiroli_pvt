import axios from '../axios'

export const getAllWorkflows = async () => {
  const response = await axios.get('/workflows')
  return response.data
}

export const getWorkflow = async (id) => {
  const response = await axios.get(`/workflows/${id}`)
  return response.data
}

export const createWorkflow = async (data) => {
  const response = await axios.post('/workflows', data)
  return response.data
}

export const updateWorkflow = async (id, data) => {
  const response = await axios.put(`/workflows/${id}`, data)
  return response.data
}

export const deleteWorkflow = async (id) => {
  const response = await axios.delete(`/workflows/${id}`)
  return response.data
}

export const getWorkflowRuns = async (id) => {
  const response = await axios.get(`/workflows/${id}/runs`)
  return response.data
}

export const runWorkflow = async (id) => {
  const response = await axios.post(`/workflows/${id}/run`)
  return response.data
}

export const workflowApi = {
  getAll: getAllWorkflows,
  getById: getWorkflow,
  create: createWorkflow,
  update: updateWorkflow,
  delete: deleteWorkflow,
  run: runWorkflow,
  getRuns: getWorkflowRuns,
};
