import axios from '../axios'

export const getErrorLogs = async () => {
  const response = await axios.get('/monitoring/errors')
  return response.data
}

export const listErrorLogs = getErrorLogs

export const getErrorById = async (id) => {
  const response = await axios.get(`/monitoring/errors/${id}`)
  return response.data
}

export const getError = getErrorById

export const resolveError = async (id) => {
  const response = await axios.put(`/monitoring/errors/${id}/resolve`)
  return response.data
}

export const getMonitoringTrends = async () => {
  const response = await axios.get('/monitoring/trends')
  return response.data
}

export const monitoringApi = {
  getErrorLogs,
  listErrorLogs,
  getErrorById,
  getError,
  resolveError,
  getMonitoringTrends,
};

export default monitoringApi;
