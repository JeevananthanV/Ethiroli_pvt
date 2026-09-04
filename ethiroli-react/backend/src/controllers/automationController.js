import AutomationWorkflow from '../models/AutomationWorkflow.js';

export const listWorkflows = async (req, res) => {
  try {
    const list = await AutomationWorkflow.list({ tenant_id: req.tenant ? req.tenant.id : null });
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createWorkflow = async (req, res) => {
  try {
    const id = await AutomationWorkflow.create({ ...req.body, tenant_id: req.tenant.id, created_by: req.user.id });
    res.status(201).json({ message: 'Automation workflow created.', id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
