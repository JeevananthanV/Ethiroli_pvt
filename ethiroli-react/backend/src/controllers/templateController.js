import CommunicationTemplate from '../models/CommunicationTemplate.js';

export const listTemplates = async (req, res) => {
  try {
    const list = await CommunicationTemplate.list({ channel: req.query.channel });
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createTemplate = async (req, res) => {
  try {
    const id = await CommunicationTemplate.create(req.body);
    res.status(201).json({ message: 'Template created.', id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
