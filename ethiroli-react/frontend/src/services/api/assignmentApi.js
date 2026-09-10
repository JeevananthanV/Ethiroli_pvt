import axios from '../axios'

export const getAssignments = async () => {
  const response = await axios.get('/assignments')
  return response.data
}

export const listAssignments = getAssignments

export const getAssignment = async (id) => {
  const response = await axios.get(`/assignments/${id}`)
  return response.data
}

export const submitAssignment = async (id, data) => {
  const response = await axios.post(`/assignments/${id}/submit`, data)
  return response.data
}

export const gradeAssignment = async (id, grade) => {
  const response = await axios.post(`/assignments/${id}/grade`, { grade })
  return response.data
}

export const assignmentApi = {
  getAll: getAssignments,
  list: listAssignments,
  getById: getAssignment,
  submit: submitAssignment,
  grade: gradeAssignment,
};
