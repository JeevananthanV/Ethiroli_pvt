import React from 'react';
import RolePortalShell from './RolePortalShell.jsx';
import HRRoutes from './roles/hr/HRApp.jsx';
import HrLoginPage from './auth/portals/pages/HrLoginPage.jsx';
import { ROLES } from './common/utils/roleRouting.js';

/**
 * HRApp - the HR / People Operations portal application (hr.html).
 * Route definitions live in roles/hr/HRApp.jsx, shared with AdminApp.
 */
export default function HRApp() {
  return (
    <RolePortalShell
      slug="hr"
      loginPage={<HrLoginPage />}
      allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR]}
      routes={<HRRoutes />}
    />
  );
}
