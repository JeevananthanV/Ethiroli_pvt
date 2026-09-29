import axios from '../axios'

export const getBadges = async () => {
  const response = await axios.get('/badges')
  return response.data
}

export const getAll = getBadges

export const getBadge = async (id) => {
  const response = await axios.get(`/badges/${id}`)
  return response.data
}

export const getUserBadges = async (userId) => {
  const response = await axios.get(`/badges/user/${userId}`)
  return response.data
}

export const awardBadge = async (userId, badgeId) => {
  const response = await axios.post('/badges/award', { userId, badgeId })
  return response.data
}

export const createBadge = async (data) => {
  const response = await axios.post('/badges', data)
  return response.data
}

export const updateBadge = async (id, data) => {
  const response = await axios.put(`/badges/${id}`, data)
  return response.data
}

export const deleteBadge = async (id) => {
  const response = await axios.delete(`/badges/${id}`)
  return response.data
}

export const revokeBadge = async (userBadgeId) => {
  const response = await axios.delete(`/user-badges/${userBadgeId}`)
  return response.data
}

export const badgeApi = {
  getBadges,
  getAll,
  getBadge,
  getUserBadges,
  awardBadge,
  createBadge,
  updateBadge,
  deleteBadge,
  revokeBadge
};

export default badgeApi;

