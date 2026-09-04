import StudentProject from '../models/StudentProject.js';

export const listStudentProjects = async (req, res) => {
  try {
    const list = await StudentProject.list({ student_id: req.query.student_id || req.user.id });
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const linkRepository = async (req, res) => {
  try {
    const id = await StudentProject.create({ ...req.body, student_id: req.user.id });
    res.status(201).json({ message: 'GitHub repository linked.', id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
