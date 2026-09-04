import Product from '../models/Product.js';

export const listProducts = async (req, res) => {
  try {
    const list = await Product.list({ tenant_id: req.tenant ? req.tenant.id : null });
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const publishProduct = async (req, res) => {
  try {
    const id = await Product.create({ ...req.body, tenant_id: req.tenant.id });
    res.status(201).json({ message: 'Course product published to marketplace.', id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
