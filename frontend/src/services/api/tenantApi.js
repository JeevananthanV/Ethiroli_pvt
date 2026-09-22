import axios from '../axios'

export const getTenants = async () => {
  const response = await axios.get('/tenants')
  return response.data
}

export const listTenants = getTenants

export const getTenant = async (id) => {
  const response = await axios.get(`/tenants/${id}`)
  return response.data
}

export const createTenant = async (data) => {
  const response = await axios.post('/tenants', data)
  return response.data
}

export const updateTenant = async (id, data) => {
  const response = await axios.put(`/tenants/${id}`, data)
  return response.data
}

export const deleteTenant = async (id) => {
  const response = await axios.delete(`/tenants/${id}`)
  return response.data
}

export const tenantApi = {
  getTenants,
  listTenants,
  getTenant,
  createTenant,
  updateTenant,
  deleteTenant,
};
