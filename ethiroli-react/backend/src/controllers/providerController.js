import ProviderConfig from '../models/ProviderConfig.js';

export const listProviders = async (req, res) => {
  try {
    const list = await ProviderConfig.list({ provider: req.query.provider });
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const saveProvider = async (req, res) => {
  try {
    const id = await ProviderConfig.create(req.body);
    res.status(200).json({ message: 'Provider config updated.', id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
