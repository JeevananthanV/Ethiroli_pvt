import AuditLog from '../models/AuditLog.js';

export const listLogs = async (req, res) => {
  const { user_id, action, limit = 50, offset = 0 } = req.query;

  try {
    const logs = await AuditLog.list({
      user_id,
      action,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10)
    });
    res.status(200).json(logs);
  } catch (error) {
    console.error('List audit logs error:', error);
    res.status(500).json({ message: 'Failed to fetch audit logs.' });
  }
};
