import Workflow from '../models/Workflow.js';

export const listWorkflows = async (req, res) => {
  try {
    const list = await Workflow.list();
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createWorkflow = async (req, res) => {
  try {
    const id = await Workflow.create(req.body);
    res.status(201).json({ message: 'Workflow created.', id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
