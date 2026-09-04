import CompanySetting from '../models/CompanySetting.js';

export const getCompanySettings = async (req, res) => {
  try {
    const settings = await CompanySetting.get();
    res.status(200).json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const saveCompanySettings = async (req, res) => {
  try {
    const id = await CompanySetting.save(req.body);
    res.status(200).json({ message: 'Company settings saved.', id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
