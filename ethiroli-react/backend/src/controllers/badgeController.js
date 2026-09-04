import Badge from '../models/Badge.js';
import UserBadge from '../models/UserBadge.js';

export const listBadges = async (req, res) => {
  try {
    const list = await Badge.list();
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createBadge = async (req, res) => {
  try {
    await Badge.create(req.body);
    res.status(201).json({ message: 'Badge definition created.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getEarnedBadges = async (req, res) => {
  try {
    const list = await UserBadge.findByUserId(req.params.userId || req.user.id);
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
