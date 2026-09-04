import Transaction from '../models/Transaction.js';

export const listTransactions = async (req, res) => {
  try {
    const list = await Transaction.list({ type: req.query.type, category: req.query.category });
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const logIncome = async (req, res) => {
  try {
    await Transaction.create({ ...req.body, type: 'INCOME', created_by: req.user.id });
    res.status(201).json({ message: 'Income logged successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const logExpense = async (req, res) => {
  try {
    await Transaction.create({ ...req.body, type: 'EXPENSE', created_by: req.user.id });
    res.status(201).json({ message: 'Expense logged successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
