import PerformanceReview from '../models/PerformanceReview.js';

export const listReviews = async (req, res) => {
  try {
    const list = await PerformanceReview.list({ employee_id: req.query.employee_id });
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const id = await PerformanceReview.create({ ...req.body, reviewer_id: req.user.id });
    res.status(201).json({ message: 'Performance review submitted.', id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
