import React from 'react';
import RolePortalShell from './RolePortalShell.jsx';
import FinanceRoutes from './roles/finance/FinanceRoutes.jsx';
import FinanceLoginPage from './auth/portals/pages/FinanceLoginPage.jsx';
import { ROLES } from './common/utils/roleRouting.js';

/**
 * FinanceApp - the Finance portal application (finance.html).
 * Route definitions live in roles/finance/FinanceRoutes.jsx, shared with AdminApp.
 */
export default function FinanceApp() {
  return (
    <RolePortalShell
      slug="finance"
      loginPage={<FinanceLoginPage />}
      allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.FINANCE]}
      routes={<FinanceRoutes />}
    />
  );
}
