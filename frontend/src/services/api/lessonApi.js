import axios from '../axios'

export const getAllLessons = async () => {
  const response = await axios.get('/lessons')
  return response.data
}

export const getLesson = async (id) => {
  const response = await axios.get(`/lessons/${id}`)
  return response.data
}

export const createLesson = async (data) => {
  const response = await axios.post('/lessons', data)
  return response.data
}

export const updateLesson = async (id, data) => {
  const response = await axios.put(`/lessons/${id}`, data)
  return response.data
}

export const deleteLesson = async (id) => {
  const response = await axios.delete(`/lessons/${id}`)
  return response.data
}

export const completeLesson = async (id) => {
  const response = await axios.post(`/lessons/${id}/complete`)
  return response.data
}

export const lessonApi = {
  getAll: getAllLessons,
  getById: getLesson,
  create: createLesson,
  update: updateLesson,
  delete: deleteLesson,
  complete: completeLesson,
};
