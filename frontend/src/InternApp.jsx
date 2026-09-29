import React from 'react';
import RolePortalShell from './RolePortalShell.jsx';
import InternRoutes from './roles/intern/InternApp.jsx';
import InternLoginPage from './auth/portals/pages/InternLoginPage.jsx';
import { ROLES } from './common/utils/roleRouting.js';

/**
 * InternApp - the Intern / IMS portal application (intern.html).
 * Route definitions live in roles/intern/InternApp.jsx, shared with AdminApp.
 */
export default function InternApp() {
  return (
    <RolePortalShell
      slug="intern"
      loginPage={<InternLoginPage />}
      allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.INTERN]}
      routes={<InternRoutes />}
    />
  );
}
