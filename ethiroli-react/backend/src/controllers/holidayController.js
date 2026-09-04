import Holiday from '../models/Holiday.js';

export const listHolidays = async (req, res) => {
  try {
    const list = await Holiday.list();
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createHoliday = async (req, res) => {
  try {
    const id = await Holiday.create(req.body);
    res.status(201).json({ message: 'Holiday registered.', id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
