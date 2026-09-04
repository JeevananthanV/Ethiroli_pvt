import ReportDefinition from '../models/ReportDefinition.js';

export const executeReport = async (req, res) => {
  try {
    res.status(200).json({ columns: [], rows: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const listReportDefinitions = async (req, res) => {
  try {
    const list = await ReportDefinition.list({ tenant_id: req.tenant ? req.tenant.id : null });
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createReportDefinition = async (req, res) => {
  try {
    const id = await ReportDefinition.create({ ...req.body, tenant_id: req.tenant.id, created_by: req.user.id });
    res.status(201).json({ message: 'Report definition saved.', id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
