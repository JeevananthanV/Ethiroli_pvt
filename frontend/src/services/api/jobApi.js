import axios from '../axios'

export const getJobs = async () => {
  const response = await axios.get('/jobs')
  return response.data
}

export const getJob = async (id) => {
  const response = await axios.get(`/jobs/${id}`)
  return response.data
}

export const createJob = async (data) => {
  const response = await axios.post('/jobs', data)
  return response.data
}

export const updateJob = async (id, data) => {
  const response = await axios.put(`/jobs/${id}`, data)
  return response.data
}

export const deleteJob = async (id) => {
  const response = await axios.delete(`/jobs/${id}`)
  return response.data
}

export const publishJob = async (id) => {
  const response = await axios.post(`/jobs/${id}/publish`)
  return response.data
}

export const getJobPostings = async () => {
  const response = await axios.get('/jobs/postings')
  return response.data
}

export const jobApi = {
  getAll: getJobs,
  getById: getJob,
  create: createJob,
  update: updateJob,
  delete: deleteJob,
  publish: publishJob,
  getPostings: getJobPostings,
};

export default jobApi;