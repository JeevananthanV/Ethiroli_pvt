import axiosInstance from './axiosInstance.js';

export const getCoupons = async (params = {}) => {
  const response = await axiosInstance.get('/v1/coupons', { params });
  return response.data;
};

export const getCoupon = async (id) => {
  const response = await axiosInstance.get(`/v1/coupons/${id}`);
  return response.data;
};

export const createCoupon = async (data) => {
  const response = await axiosInstance.post('/v1/coupons', data);
  return response.data;
};

export const updateCoupon = async (id, data) => {
  const response = await axiosInstance.put(`/v1/coupons/${id}`, data);
  return response.data;
};

export const deleteCoupon = async (id) => {
  const response = await axiosInstance.delete(`/v1/coupons/${id}`);
  return response.data;
};

export const validateCoupon = async (code) => {
  const response = await axiosInstance.post('/v1/coupons/validate', { code });
  return response.data;
};

export const couponApi = {
  getAll: getCoupons,
  getCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon
};

export default couponApi;

