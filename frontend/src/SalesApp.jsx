import React from 'react';
import RolePortalShell from './RolePortalShell.jsx';
import SalesRoutes from './roles/sales/SalesRoutes.jsx';
import SalesLoginPage from './auth/portals/pages/SalesLoginPage.jsx';
import { ROLES } from './common/utils/roleRouting.js';

/**
 * SalesApp - the Sales portal application (sales.html).
 * Route definitions live in roles/sales/SalesRoutes.jsx, shared with AdminApp.
 */
export default function SalesApp() {
  return (
    <RolePortalShell
      slug="sales"
      loginPage={<SalesLoginPage />}
      allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.SALES]}
      routes={<SalesRoutes />}
    />
  );
}
