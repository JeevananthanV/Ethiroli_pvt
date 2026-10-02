import React from 'react';
import RolePortalShell from './RolePortalShell.jsx';
import InternRoutes from './roles/intern/InternApp.jsx';
import InternLoginPage from './auth/portals/pages/InternLoginPage.jsx';
import { ROLES } from './common/utils/roleRouting.js';
// Intern-only control sizing. Scoped by .ims-scope in the stylesheet, so it
// cannot affect the other portals.
import './roles/intern/internPortal.css';

/**
 * InternApp - the Intern / IMS portal application (intern.html).
 * Route definitions live in roles/intern/InternApp.jsx, shared with AdminApp.
 */
export default function InternApp() {
  return (
    // .ims-scope is the root of the intern stylesheet's rules, which keeps
    // the control sizing inside this portal.
    <div className="ims-scope">
      <RolePortalShell
        slug="intern"
        loginPage={<InternLoginPage />}
        allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.INTERN]}
        routes={<InternRoutes />}
      />
    </div>
  );
}
