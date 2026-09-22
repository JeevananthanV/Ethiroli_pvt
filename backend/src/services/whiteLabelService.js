import pool from '../config/database.js';
import { logger } from '../config/logger.js';

export const getTheme = async (tenantId) => {
  logger.info('Fetching white-label theme', { tenantId });

  try {
    const [rows] = await pool.execute('SELECT * FROM tenants WHERE id = ?', [tenantId]);

    if (rows.length === 0) {
      throw new Error('Tenant not found');
    }

    const tenant = rows[0];
    const theme = tenant.settings ? JSON.parse(tenant.settings) : {};

    const defaultTheme = {
      primaryColor: '#4F46E5',
      secondaryColor: '#0EA5E9',
      logo: '/assets/logo.png',
      favicon: '/assets/favicon.ico',
      fontFamily: 'Inter, sans-serif',
      borderRadius: '8px',
      customCss: ''
    };

    const mergedTheme = { ...defaultTheme, ...theme };

    logger.info('White-label theme fetched', { tenantId });

    return {
      success: true,
      tenantId,
      theme: mergedTheme
    };
  } catch (error) {
    logger.error('Failed to fetch white-label theme', { tenantId, error: error.message });
    throw error;
  }
};

export const updateTheme = async (tenantId, theme) => {
  logger.info('Updating white-label theme', { tenantId });

  try {
    const [existingRows] = await pool.execute('SELECT settings FROM tenants WHERE id = ?', [tenantId]);
    if (existingRows.length === 0) {
      throw new Error('Tenant not found');
    }

    const existingSettings = existingRows[0].settings ? JSON.parse(existingRows[0].settings) : {};
    const updatedSettings = { ...existingSettings, ...theme, updatedAt: new Date().toISOString() };

    await pool.execute(
      'UPDATE tenants SET settings = ? WHERE id = ?',
      [JSON.stringify(updatedSettings), tenantId]
    );

    logger.info('White-label theme updated', { tenantId });

    return {
      success: true,
      tenantId,
      theme: updatedSettings
    };
  } catch (error) {
    logger.error('Failed to update white-label theme', { tenantId, error: error.message });
    throw error;
  }
};
