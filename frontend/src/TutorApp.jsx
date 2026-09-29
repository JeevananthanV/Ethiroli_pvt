import React from 'react';
import RolePortalShell from './RolePortalShell.jsx';
import TutorRoutes from './roles/tutor/TutorRoutes.jsx';
import TutorLoginPage from './auth/portals/pages/TutorLoginPage.jsx';
import { ROLES } from './common/utils/roleRouting.js';

/**
 * TutorApp - the Tutor / Teaching portal application (tutor.html).
 * Route definitions live in roles/tutor/TutorRoutes.jsx, shared with AdminApp.
 */
export default function TutorApp() {
  return (
    <RolePortalShell
      slug="tutor"
      loginPage={<TutorLoginPage />}
      allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TUTOR]}
      routes={<TutorRoutes />}
    />
  );
}
