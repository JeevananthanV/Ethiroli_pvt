import Employee from '../models/Employee.js';

export const listEmployees = async (req, res) => {
  try {
    const list = await Employee.list();
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const id = await Employee.create(req.body);
    res.status(201).json({ message: 'Employee created successfully.', id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getEmployee = async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ message: 'Employee not found.' });
    res.status(200).json(emp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    await Employee.update(req.params.id, req.body);
    res.status(200).json({ message: 'Employee updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
