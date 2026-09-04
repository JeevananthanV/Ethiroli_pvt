import CommunicationLog from '../models/CommunicationLog.js';
import { broadcastToUser } from '../services/socketService.js';

export const sendMessage = async (req, res) => {
  try {
    const id = await CommunicationLog.create({ ...req.body, created_by: req.user.id, status: 'SENT' });
    broadcastToUser(req.user.id, 'communication_sent', { id, recipient: req.body.recipient });
    res.status(200).json({ message: 'Message sent successfully.', id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const sendBulkMessages = async (req, res) => {
  try {
    const { recipients, channel, content } = req.body;
    for (const recipient of recipients.slice(0, 100)) {
      await CommunicationLog.create({ channel, recipient, content, created_by: req.user.id, status: 'SENT' });
    }
    res.status(200).json({ message: 'Bulk messages processed successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const listLogs = async (req, res) => {
  try {
    const list = await CommunicationLog.list({ channel: req.query.channel, status: req.query.status });
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
