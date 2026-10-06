import React from 'react';
import RolePortalShell from './RolePortalShell.jsx';
import PmRoutes from './roles/project-manager/PmRoutes.jsx';
import PmLoginPage from './auth/portals/pages/PmLoginPage.jsx';
import { ROLES } from './common/utils/roleRouting.js';
import './roles/project-manager/pm-overrides.css';

/**
 * PmApp - the Project Manager portal application (pm.html).
 * Route definitions live in roles/project-manager/PmRoutes.jsx, shared with AdminApp.
 */
export default function PmApp() {
  return (
    <RolePortalShell
      slug="pm"
      loginPage={<PmLoginPage />}
      allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.PROJECT_MANAGER]}
      routes={<PmRoutes />}
    />
  );
}
