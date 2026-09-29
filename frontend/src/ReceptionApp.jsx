import React from 'react';
import RolePortalShell from './RolePortalShell.jsx';
import ReceptionRoutes from './roles/reception/ReceptionRoutes.jsx';
import ReceptionLoginPage from './auth/portals/pages/ReceptionLoginPage.jsx';
import { ROLES } from './common/utils/roleRouting.js';

/**
 * ReceptionApp - the Reception portal application (reception.html).
 * Route definitions live in roles/reception/ReceptionRoutes.jsx, shared with AdminApp.
 */
export default function ReceptionApp() {
  return (
    <RolePortalShell
      slug="reception"
      loginPage={<ReceptionLoginPage />}
      allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.RECEPTION]}
      routes={<ReceptionRoutes />}
    />
  );
}
