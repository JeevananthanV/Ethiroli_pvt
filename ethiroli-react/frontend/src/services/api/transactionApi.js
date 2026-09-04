import axiosInstance from './axiosInstance.js';

export const getTransactions = async (params) => {
  const response = await axiosInstance.get('/v1/transactions', { params });
  return response.data;
};

export const logIncome = async (incomeData) => {
  const response = await axiosInstance.post('/v1/transactions/income', incomeData);
  return response.data;
};

export const logExpense = async (expenseData) => {
  const response = await axiosInstance.post('/v1/transactions/expense', expenseData);
  return response.data;
};
