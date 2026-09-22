import axios from '../axios'

export const getSystemStatus = async () => {
  const response = await axios.get('/system/status')
  return response.data
}

export const getStatus = getSystemStatus

export const getHealth = async () => {
  const response = await axios.get('/system/health')
  return response.data
}

export const getMetrics = async () => {
  const response = await axios.get('/system/metrics')
  return response.data
}

export const updateConfigs = async (data) => {
  const response = await axios.put('/system/config', data)
  return response.data
}

export const systemApi = {
  getSystemStatus,
  getStatus,
  getHealth,
  getMetrics,
  updateConfigs,
};

export default systemApi;
