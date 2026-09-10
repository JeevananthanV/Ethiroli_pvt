import axios from '../axios'

export const getPayments = async () => {
  const response = await axios.get('/payments')
  return response.data
}

export const listPayments = getPayments

export const getPayment = async (id) => {
  const response = await axios.get(`/payments/${id}`)
  return response.data
}

export const createPayment = async (data) => {
  const response = await axios.post('/payments', data)
  return response.data
}

export const updatePayment = async (id, data) => {
  const response = await axios.put(`/payments/${id}`, data)
  return response.data
}

export const deletePayment = async (id) => {
  const response = await axios.delete(`/payments/${id}`)
  return response.data
}

export const recordPayment = createPayment;

export const paymentApi = {
  getAll: getPayments,
  list: listPayments,
  getById: getPayment,
  create: createPayment,
  recordPayment,
  update: updatePayment,
  delete: deletePayment,
};

export default paymentApi;
