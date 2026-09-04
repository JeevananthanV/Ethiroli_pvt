import Subscription from '../models/Subscription.js';

export const listSubscriptions = async (req, res) => {
  try {
    const list = await Subscription.list({ client_id: req.query.client_id });
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createSubscription = async (req, res) => {
  try {
    const id = await Subscription.create(req.body);
    res.status(201).json({ message: 'Subscription created successfully.', id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateSubscription = async (req, res) => {
  try {
    await Subscription.update(req.params.id, req.body);
    res.status(200).json({ message: 'Subscription updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
