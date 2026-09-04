import Coupon from '../models/Coupon.js';

export const listCoupons = async (req, res) => {
  try {
    res.status(200).json([]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createCoupon = async (req, res) => {
  try {
    const id = await Coupon.create({ ...req.body, tenant_id: req.tenant.id, created_by: req.user.id });
    res.status(201).json({ message: 'Coupon generated.', id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
