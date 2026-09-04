import Tenant from '../models/Tenant.js';

export const listTenants = async (req, res) => {
  try {
    const list = await Tenant.list();
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createTenant = async (req, res) => {
  try {
    const id = await Tenant.create(req.body);
    res.status(201).json({ message: 'Tenant created.', id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
