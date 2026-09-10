import axios from '../axios'

export const getAllModules = async () => {
  const response = await axios.get('/modules')
  return response.data
}

export const getModule = async (id) => {
  const response = await axios.get(`/modules/${id}`)
  return response.data
}

export const createModule = async (data) => {
  const response = await axios.post('/modules', data)
  return response.data
}

export const updateModule = async (id, data) => {
  const response = await axios.put(`/modules/${id}`, data)
  return response.data
}

export const deleteModule = async (id) => {
  const response = await axios.delete(`/modules/${id}`)
  return response.data
}

export const reorderModule = async (id, order) => {
  const response = await axios.put(`/modules/${id}/reorder`, { order })
  return response.data
}

export const moduleApi = {
  getAll: getAllModules,
  getById: getModule,
  create: createModule,
  update: updateModule,
  delete: deleteModule,
  reorder: reorderModule,
};

export default moduleApi;

