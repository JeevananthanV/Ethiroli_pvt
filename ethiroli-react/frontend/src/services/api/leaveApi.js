import axios from '../axios'

export const getLeaves = async () => {
  const response = await axios.get('/leaves')
  return response.data
}

export const getLeave = async (id) => {
  const response = await axios.get(`/leaves/${id}`)
  return response.data
}

export const createLeave = async (data) => {
  const response = await axios.post('/leaves', data)
  return response.data
}

export const updateLeave = async (id, data) => {
  const response = await axios.put(`/leaves/${id}`, data)
  return response.data
}

export const deleteLeave = async (id) => {
  const response = await axios.delete(`/leaves/${id}`)
  return response.data
}

export const updateLeaveStatus = async (id, status) => {
  const response = await axios.patch(`/leaves/${id}/status`, { status })
  return response.data
}

export const approveLeave = async (id) => {
  return updateLeaveStatus(id, 'approved')
}

export const rejectLeave = async (id) => {
  return updateLeaveStatus(id, 'rejected')
}

export const listLeaves = getLeaves;

export const leaveApi = {
  getAll: getLeaves,
  getById: getLeave,
  create: createLeave,
  update: updateLeave,
  delete: deleteLeave,
  updateStatus: updateLeaveStatus,
  approve: approveLeave,
  reject: rejectLeave,
};

export default leaveApi;