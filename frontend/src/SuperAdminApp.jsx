import React from 'react';
import RolePortalShell from './RolePortalShell.jsx';
import SuperAdminRoutes from './roles/super-admin/SuperAdminApp.jsx';
import SuperAdminLoginPage from './auth/portals/pages/SuperAdminLoginPage.jsx';
import { ROLES } from './common/utils/roleRouting.js';

/**
 * SuperAdminApp - the Super Admin multi-tenant portal application (super-admin.html).
 * Route definitions live in roles/super-admin/SuperAdminApp.jsx, shared with AdminApp.
 */
export default function SuperAdminApp() {
  return (
    <RolePortalShell
      slug="super-admin"
      loginPage={<SuperAdminLoginPage />}
      allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN]}
      routes={<SuperAdminRoutes />}
    />
  );
}
