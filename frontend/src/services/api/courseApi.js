import axios from '../axios'

const unwrap = (res) => {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.data?.data)) return res.data.data;
  return res.data ?? res;
};

export const getCourses = async () => {
  const response = await axios.get('/courses')
  return unwrap(response)
}

export const getCourse = async (id) => {
  const response = await axios.get(`/courses/${id}`)
  return response?.data ?? response
}

export const createCourse = async (data) => {
  const response = await axios.post('/courses', data)
  return response.data
}

export const updateCourse = async (id, data) => {
  const response = await axios.put(`/courses/${id}`, data)
  return response.data
}

export const deleteCourse = async (id) => {
  const response = await axios.delete(`/courses/${id}`)
  return response.data
}

export const publishCourse = async (id) => {
  const response = await axios.post(`/courses/${id}/publish`)
  return response.data
}

export const listCourses = getCourses;

export const courseApi = {
  getAll: getCourses,
  getById: getCourse,
  create: createCourse,
  update: updateCourse,
  delete: deleteCourse,
  publish: publishCourse,
};

export default courseApi;