import axiosInstance from './axiosInstance.js';

export const listCoupons = async () => {
  const response = await axiosInstance.get('/v1/coupons');
  return response.data;
};
export const getCoupons = listCoupons;

export const getCoupon = async (id) => {
  const response = await axiosInstance.get(`/v1/coupons/${id}`);
  return response.data;
};

export const createCoupon = async (data) => {
  const response = await axiosInstance.post('/v1/coupons', data);
  return response.data;
};

export const updateCoupon = async (id, data) => {
  const response = await axiosInstance.patch(`/v1/coupons/${id}`, data);
  return response.data;
};

export const deleteCoupon = async (id) => {
  const response = await axiosInstance.delete(`/v1/coupons/${id}`);
  return response.data;
};
