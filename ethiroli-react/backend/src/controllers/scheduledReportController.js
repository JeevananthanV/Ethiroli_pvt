import ScheduledReport from '../models/ScheduledReport.js';

export const listSchedules = async (req, res) => {
  try {
    res.status(200).json([]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createSchedule = async (req, res) => {
  try {
    const id = await ScheduledReport.create({ ...req.body, tenant_id: req.tenant.id });
    res.status(201).json({ message: 'Report scheduled.', id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
