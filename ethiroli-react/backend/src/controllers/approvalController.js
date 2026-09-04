import ApprovalInstance from '../models/ApprovalInstance.js';

export const listPendingApprovals = async (req, res) => {
  try {
    const list = await ApprovalInstance.listPending(req.user.id);
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const initiateApproval = async (req, res) => {
  try {
    const id = await ApprovalInstance.create({ ...req.body, initiated_by: req.user.id });
    res.status(201).json({ message: 'Approval chain started.', id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
