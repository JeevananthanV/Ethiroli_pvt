import axios from '../axios'

export const getProjects = async () => {
  const response = await axios.get('/projects')
  return response.data
}

export const getProject = async (id) => {
  const response = await axios.get(`/projects/${id}`)
  return response.data
}

export const createProject = async (data) => {
  const response = await axios.post('/projects', data)
  return response.data
}

export const updateProject = async (id, data) => {
  const response = await axios.put(`/projects/${id}`, data)
  return response.data
}

export const deleteProject = async (id) => {
  const response = await axios.delete(`/projects/${id}`)
  return response.data
}

export const listProjects = getProjects;

export const projectApi = {
  getProjects,
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
};
