import axios from '../axios'

const unwrapList = (response) => {
  const body = response?.data ?? response
  return Array.isArray(body) ? body : (Array.isArray(body?.data) ? body.data : [])
}

export const getProjects = async () => {
  const response = await axios.get('/projects')
  return unwrapList(response)
}

export const getProject = async (id) => {
  const response = await axios.get(`/projects/${id}`)
  return response.data?.data || response.data
}

export const createProject = async (data) => {
  const response = await axios.post('/projects', data)
  return response.data?.data || response.data
}

export const updateProject = async (id, data) => {
  const response = await axios.put(`/projects/${id}`, data)
  return response.data?.data || response.data
}

export const deleteProject = async (id) => {
  const response = await axios.delete(`/projects/${id}`)
  return response.data?.data || response.data
}

/**
 * Active users a project may be handed to (the "Responsible for delivery"
 * picker). Server-side filtered to roles that can actually own a project.
 */
export const getAssignableUsers = async () => {
  const response = await axios.get('/projects/assignable-users')
  const body = response?.data ?? response
  return Array.isArray(body) ? body : (Array.isArray(body?.data) ? body.data : [])
}

export const listProjects = getProjects

export const getStudentProjects = getProjects

export const projectApi = {
  getProjects,
  listProjects,
  getStudentProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getAssignableUsers,
}
