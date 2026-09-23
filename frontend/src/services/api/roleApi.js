import axiosInstance from './axiosInstance.js';

/**
 * Fetches dynamic navigation tree for the current authenticated user's role from MySQL
 * @returns {Promise<{role: string, navigation: Array, source: string}>}
 */
export const getRoleNavigation = async () => {
  const res = await axiosInstance.get('/v1/role/navigation');
  return res?.data || res;
};

/**
 * Updates dynamic navigation tree in MySQL system_configs
 * @param {string} targetRole
 * @param {Array} navigation
 */
export const updateRoleNavigation = async (targetRole, navigation) => {
  const res = await axiosInstance.put('/v1/role/navigation', { targetRole, navigation });
  return res?.data || res;
};

/**
 * Fetches the complete Server-Driven UI (SDUI) portal configuration
 * (Dynamic navigation, widget layout, theme branding, active permissions)
 * @returns {Promise<{role: string, navigation: Array, widgets: Array, theme: Object, permissions: Array}>}
 */
export const getRolePortalConfig = async () => {
  const res = await axiosInstance.get('/v1/role/portal-config');
  return res?.data || res;
};

/**
 * Fetches real-time live database analytics computed directly from MySQL
 * @returns {Promise<{role: string, dashboard: Object}>}
 */
export const getRoleDashboard = async () => {
  const res = await axiosInstance.get('/v1/role/dashboard');
  return res?.data || res;
};

/**
 * Fetches authenticated user profile
 */
export const getRoleProfile = async () => {
  const res = await axiosInstance.get('/v1/role/profile');
  return res?.data || res;
};

/**
 * Fetches dynamic permissions list for current role
 */
export const getRolePermissions = async () => {
  const res = await axiosInstance.get('/v1/role/permissions');
  return res?.data || res;
};

export default {
  getRoleNavigation,
  updateRoleNavigation,
  getRolePortalConfig,
  getRoleDashboard,
  getRoleProfile,
  getRolePermissions,
};
