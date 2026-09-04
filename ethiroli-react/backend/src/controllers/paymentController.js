import Payment from '../models/Payment.js';

export const listPayments = async (req, res) => {
  try {
    const list = await Payment.list({ status: req.query.status });
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const recordPayment = async (req, res) => {
  try {
    await Payment.create(req.body);
    res.status(201).json({ message: 'Payment recorded.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const razorpayWebhook = async (req, res) => {
  res.status(200).send('OK');
};

export const stripeWebhook = async (req, res) => {
  res.status(200).send('OK');
};
