import axios from '../axios'

export const getAllTransactions = async () => {
  const response = await axios.get('/transactions')
  return response.data
}

export const getTransaction = async (id) => {
  const response = await axios.get(`/transactions/${id}`)
  return response.data
}

export const createTransaction = async (data) => {
  const response = await axios.post('/transactions', data)
  return response.data
}

export const updateTransaction = async (id, data) => {
  const response = await axios.put(`/transactions/${id}`, data)
  return response.data
}

export const deleteTransaction = async (id) => {
  const response = await axios.delete(`/transactions/${id}`)
  return response.data
}

export const getTransactions = getAllTransactions;
export const listTransactions = getAllTransactions;

export const logIncome = async (data) => {
  return createTransaction({ ...data, type: 'income' });
};

export const logExpense = async (data) => {
  return createTransaction({ ...data, type: 'expense' });
};

export const transactionApi = {
  getAll: getAllTransactions,
  getById: getTransaction,
  create: createTransaction,
  update: updateTransaction,
  delete: deleteTransaction,
  logIncome,
  logExpense,
};

export default transactionApi;
