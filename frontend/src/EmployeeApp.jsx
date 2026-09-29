import React from 'react';
import RolePortalShell from './RolePortalShell.jsx';
import EmployeeRoutes from './roles/employee/EmployeeRoutes.jsx';
import EmployeeLoginPage from './auth/portals/pages/EmployeeLoginPage.jsx';
import { ROLES } from './common/utils/roleRouting.js';

/**
 * EmployeeApp - the Employee portal application (employee.html).
 * Route definitions live in roles/employee/EmployeeRoutes.jsx, shared with AdminApp.
 */
export default function EmployeeApp() {
  return (
    <RolePortalShell
      slug="employee"
      loginPage={<EmployeeLoginPage />}
      allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EMPLOYEE]}
      routes={<EmployeeRoutes />}
    />
  );
}
