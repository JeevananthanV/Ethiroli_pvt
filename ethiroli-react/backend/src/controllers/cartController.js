import CartSession from '../models/CartSession.js';

export const getCart = async (req, res) => {
  try {
    res.status(200).json({ items: [], total: 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const checkoutCart = async (req, res) => {
  try {
    res.status(200).json({ message: 'Checkout successful.', orderId: 'ord-' + Date.now() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
