import Integration from '../models/Integration.js';

export const listIntegrations = async (req, res) => {
  try {
    const list = await Integration.list();
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const saveIntegration = async (req, res) => {
  try {
    const id = await Integration.create(req.body);
    res.status(200).json({ message: 'Integration settings saved.', id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
