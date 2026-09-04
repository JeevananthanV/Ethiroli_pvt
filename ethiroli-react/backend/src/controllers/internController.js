import Intern from '../models/Intern.js';

export const listInterns = async (req, res) => {
  try {
    const list = await Intern.list();
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createIntern = async (req, res) => {
  try {
    await Intern.create(req.body);
    res.status(201).json({ message: 'Intern created successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
