import { AppError, NotFoundError } from '../utils/errors.js';
import pool from '../config/database.js';

export const resolveTenant = async (req, res, next) => {
  const host = req.headers.host || '';
  const subdomain = host.split('.')[0];
  const tenantHeader = req.headers['x-tenant-id'] || req.query.tenant_id;

  try {
    let tenant = null;

    if (tenantHeader) {
      const [rows] = await pool.execute(
        'SELECT * FROM tenants WHERE id = ? OR subdomain = ?',
        [tenantHeader, tenantHeader]
      );
      if (rows.length > 0) tenant = rows[0];
    } else if (subdomain && subdomain !== 'localhost' && subdomain !== 'www' && subdomain !== '127.0.0.1') {
      const [rows] = await pool.execute(
        'SELECT * FROM tenants WHERE subdomain = ?',
        [subdomain]
      );
      if (rows.length > 0) tenant = rows[0];
    }

    if (!tenant) {
      req.tenant = undefined;
      return next();
    }

    let settings = {};
    if (tenant.settings) {
      try {
        settings = JSON.parse(tenant.settings);
      } catch {
        settings = {};
      }
    }

    req.tenant = {
      id: tenant.id,
      domain: tenant.domain,
      subdomain: tenant.subdomain,
      settings,
      is_active: tenant.is_active
    };

    next();
  } catch (error) {
    // Non-fatal fallback: allow standard non-tenant requests to proceed
    req.tenant = undefined;
    next();
  }
};
