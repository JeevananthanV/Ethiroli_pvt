import Certificate from '../models/Certificate.js';

export const listCertificates = async (req, res) => {
  try {
    const list = await Certificate.list({ student_id: req.query.student_id || req.user.id });
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const generateCertificate = async (req, res) => {
  try {
    const id = await Certificate.create(req.body);
    res.status(201).json({ message: 'Certificate issued successfully.', id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
