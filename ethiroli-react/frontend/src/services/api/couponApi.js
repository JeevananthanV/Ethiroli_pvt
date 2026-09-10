import axiosInstance from './axiosInstance.js';

export const getCoupons = async () => {
  const response = await axiosInstance.get('/v1/coupons');
  return response.data;
};

export const createCoupon = async (data) => {
  const response = await axiosInstance.post('/v1/coupons', data);
  return response.data;
};
