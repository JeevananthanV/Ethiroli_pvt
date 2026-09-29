import React from 'react';
import RolePortalShell from './RolePortalShell.jsx';
import StudentRoutes from './roles/student/StudentRoutes.jsx';
import StudentLoginPage from './auth/portals/pages/StudentLoginPage.jsx';
import { ROLES } from './common/utils/roleRouting.js';

/**
 * StudentApp - the Student LMS portal application (student.html).
 * Route definitions live in roles/student/StudentRoutes.jsx, which is also
 * mounted by AdminApp, so both entry points share one route table.
 */
export default function StudentApp() {
  return (
    <RolePortalShell
      slug="student"
      loginPage={<StudentLoginPage />}
      allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.STUDENT]}
      routes={<StudentRoutes />}
    />
  );
}
