import axios from '../axios'

export const getCommunications = async () => {
  const response = await axios.get('/communication')
  return response.data
}

export const getCommunication = async (id) => {
  const response = await axios.get(`/communication/${id}`)
  return response.data
}

export const sendCommunication = async (data) => {
  const response = await axios.post('/communication/send', data)
  return response.data
}

export const getCommunicationLogs = async (params = {}) => {
  const response = await axios.get('/communication/logs', { params })
  return response.data
}

export const communicationApi = {
  getAll: getCommunications,
  getById: getCommunication,
  send: sendCommunication,
  getLogs: getCommunicationLogs,
};
