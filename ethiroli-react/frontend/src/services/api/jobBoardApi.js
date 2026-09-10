import axios from '../axios'

export const getJobBoardPosts = async () => {
  const response = await axios.get('/job-board')
  return response.data
}

export const listJobBoardPosts = getJobBoardPosts

export const getJobBoardPost = async (id) => {
  const response = await axios.get(`/job-board/${id}`)
  return response.data
}

export const createJobBoardPost = async (data) => {
  const response = await axios.post('/job-board', data)
  return response.data
}

export const updateJobBoardPost = async (id, data) => {
  const response = await axios.put(`/job-board/${id}`, data)
  return response.data
}

export const deleteJobBoardPost = async (id) => {
  const response = await axios.delete(`/job-board/${id}`)
  return response.data
}

export const getJobBoardAnalytics = async (id) => {
  const response = await axios.get(`/job-board/${id}/analytics`)
  return response.data
}

export const publishJobBoardPost = async (id, platforms) => {
  const response = await axios.post(`/job-board/${id}/publish`, { platforms })
  return response.data
}

export const jobBoardApi = {
  getJobBoardPosts,
  listJobBoardPosts,
  getJobBoardPost,
  createJobBoardPost,
  updateJobBoardPost,
  deleteJobBoardPost,
  getJobBoardAnalytics,
  publishJobBoardPost,
};

export default jobBoardApi;
