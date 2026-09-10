import axios from '../axios'

export const getAllCandidates = async () => {
  const response = await axios.get('/candidates')
  return response.data
}

export const getCandidate = async (id) => {
  const response = await axios.get(`/candidates/${id}`)
  return response.data
}

export const createCandidate = async (data) => {
  const response = await axios.post('/candidates', data)
  return response.data
}

export const updateCandidate = async (id, data) => {
  const response = await axios.put(`/candidates/${id}`, data)
  return response.data
}

export const deleteCandidate = async (id) => {
  const response = await axios.delete(`/candidates/${id}`)
  return response.data
}

export const candidateApi = {
  getAll: getAllCandidates,
  getById: getCandidate,
  create: createCandidate,
  update: updateCandidate,
  delete: deleteCandidate,
};
