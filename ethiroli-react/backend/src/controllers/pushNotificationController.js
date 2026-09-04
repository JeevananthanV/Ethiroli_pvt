import DeviceRegistration from '../models/DeviceRegistration.js';

export const registerDevice = async (req, res) => {
  try {
    const id = await DeviceRegistration.create({ ...req.body, tenant_id: req.tenant.id, user_id: req.user.id });
    res.status(201).json({ message: 'Device token registered.', id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
