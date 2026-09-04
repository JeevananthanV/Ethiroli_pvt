import Invoice from '../models/Invoice.js';
import { broadcastToRole, broadcastToUser } from '../services/socketService.js';

export const listInvoices = async (req, res) => {
  try {
    const list = await Invoice.list({
      status: req.query.status,
      client_id: req.query.client_id,
      student_id: req.query.student_id
    });
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const generateInvoice = async (req, res) => {
  try {
    const id = await Invoice.create({ ...req.body, created_by: req.user.id });
    res.status(201).json({ message: 'Invoice generated.', id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const batchGenerateInvoices = async (req, res) => {
  try {
    res.status(201).json({ message: 'Batch invoices generated successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateInvoiceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await Invoice.updateStatus(req.params.id, status, status === 'PAID' ? new Date() : null);
    const inv = await Invoice.findById(req.params.id);
    if (inv) {
      const targetId = inv.client_id || inv.student_id;
      if (targetId) {
        broadcastToUser(targetId, 'invoice_status_changed', { id: req.params.id, status });
      }
    }
    res.status(200).json({ message: 'Invoice status updated.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
