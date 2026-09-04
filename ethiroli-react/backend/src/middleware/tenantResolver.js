import pool from '../config/database.js';

export const resolveTenant = async (req, res, next) => {
  // Extract tenant from subdomain, custom headers, or query params for testing
  const host = req.headers.host || '';
  const subdomain = host.split('.')[0];
  const tenantHeader = req.headers['x-tenant-id'] || req.query.tenant_id;

  try {
    let tenant = null;

    if (tenantHeader) {
      const [rows] = await pool.execute('SELECT * FROM tenants WHERE id = ? OR subdomain = ?', [tenantHeader, tenantHeader]);
      if (rows.length > 0) tenant = rows[0];
    } else if (subdomain && subdomain !== 'localhost' && subdomain !== 'www') {
      const [rows] = await pool.execute('SELECT * FROM tenants WHERE subdomain = ?', [subdomain]);
      if (rows.length > 0) tenant = rows[0];
    }

    // Default fallback tenant to prevent application failure on local dev
    if (!tenant) {
      const [rows] = await pool.execute('SELECT * FROM tenants ORDER BY created_at ASC LIMIT 1');
      if (rows.length > 0) tenant = rows[0];
    }

    req.tenant = tenant;
    next();
  } catch (err) {
    next(err);
  }
};
