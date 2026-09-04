import Assignment from '../models/Assignment.js';

export const createAssignment = async (req, res) => {
  try {
    await Assignment.create(req.body);
    res.status(201).json({ message: 'Assignment created successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAssignment = async (req, res) => {
  try {
    const ass = await Assignment.findById(req.params.id);
    if (!ass) return res.status(404).json({ message: 'Assignment not found.' });
    res.status(200).json(ass);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
