import axiosInstance from './axiosInstance.js';

export const login = async (email, password, portal = null, mfaToken = null) => {
  const payload = { email, password };
  const headers = {};
  if (portal) {
    headers['X-Portal'] = String(portal).trim().toLowerCase();
  }
  if (mfaToken) {
    payload.mfaToken = mfaToken;
  }
  const response = await axiosInstance.post('/v1/auth/portal-login', payload, { headers });
  return response.data;
};

export const logout = async (portal = null) => {
  const payload = portal ? { portal: String(portal).trim().toLowerCase() } : {};
  const response = await axiosInstance.post('/v1/auth/logout', payload);
  return response.data;
};

export const getMe = async () => {
  const response = await axiosInstance.get('/v1/auth/me');
  return response.data;
};
