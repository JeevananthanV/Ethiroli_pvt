import Job from '../models/Job.js';

export const listJobs = async (req, res) => {
  try {
    const list = await Job.list();
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createJob = async (req, res) => {
  try {
    const id = await Job.create({ ...req.body, created_by: req.user.id });
    res.status(201).json({ message: 'Job posting created.', id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
