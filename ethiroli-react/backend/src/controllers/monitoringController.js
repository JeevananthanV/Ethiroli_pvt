import SystemErrorLog from '../models/SystemErrorLog.js';

export const listErrorLogs = async (req, res) => {
  try {
    const list = await SystemErrorLog.list();
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const resolveError = async (req, res) => {
  try {
    await SystemErrorLog.resolve(req.params.id, req.body.notes, req.user.id);
    res.status(200).json({ message: 'Error log marked as resolved.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
