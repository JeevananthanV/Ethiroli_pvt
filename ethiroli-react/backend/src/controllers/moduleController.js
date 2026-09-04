import Module from '../models/Module.js';

export const listModules = async (req, res) => {
  try {
    const list = await Module.listByCourseId(req.params.courseId);
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createModule = async (req, res) => {
  try {
    await Module.create({ ...req.body, course_id: req.params.courseId });
    res.status(201).json({ message: 'Module created successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateModule = async (req, res) => {
  try {
    await Module.update(req.params.id, req.body);
    res.status(200).json({ message: 'Module updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteModule = async (req, res) => {
  try {
    await Module.delete(req.params.id);
    res.status(200).json({ message: 'Module deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
