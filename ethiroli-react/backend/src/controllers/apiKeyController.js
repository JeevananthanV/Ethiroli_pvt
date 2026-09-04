import ApiKey from '../models/ApiKey.js';

export const listApiKeys = async (req, res) => {
  try {
    const list = await ApiKey.list({ tenant_id: req.tenant ? req.tenant.id : null });
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createApiKey = async (req, res) => {
  try {
    const id = await ApiKey.create({ ...req.body, tenant_id: req.tenant.id, user_id: req.user.id });
    res.status(201).json({ message: 'API key generated.', id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
