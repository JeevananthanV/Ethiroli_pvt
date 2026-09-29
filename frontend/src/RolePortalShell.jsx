import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/index.js';
import { AuthProvider } from './common/contexts/AuthContext.jsx';
import { SocketProvider } from './common/contexts/SocketContext.jsx';
import { ThemeProvider } from './common/contexts/ThemeContext.jsx';
import PrivateRoute from './common/components/PrivateRoute/PrivateRoute.jsx';
import Unauthorized from './common/components/Unauthorized/Unauthorized.jsx';
import MainLayout from './common/layout/MainLayout.jsx';
import { ROLES } from './common/utils/roleRouting.js';

/**
 * RolePortalShell - the shared bootstrap for every role portal entry
 * (student.html, tutor.html, intern.html, pm.html, ...).
 *
 * It owns the provider stack (Redux / theme / auth / socket) and the router,
 * registers the portal-specific login + alias routes, and mounts the role's
 * route tree at `/app/<slug>/*` behind the same PrivateRoute + MainLayout
 * combination AdminApp uses, so a portal behaves identically to the shared
 * admin console for that role.
 *
 * @param {string}   slug          URL namespace of the portal, e.g. "student".
 * @param {React.Element} loginPage The portal's login screen.
 * @param {string[]} allowedRoles  Roles permitted inside this portal.
 * @param {React.Element} routes   The role route tree (e.g. `<StudentRoutes />`).
 */
export default function RolePortalShell({ slug, loginPage, allowedRoles, routes }) {
  const home = `/app/${slug}/dashboard`;
  const login = `/auth/${slug}/login`;

  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <Routes>
                {/* Portal login screens (canonical + historic aliases). */}
                <Route path={login} element={loginPage} />
                <Route path={`/${slug}/login`} element={<Navigate to={login} replace />} />
                <Route path={`/app/${slug}/login`} element={<Navigate to={login} replace />} />
                <Route path="/auth/login" element={<Navigate to={login} replace />} />
                <Route path="/login" element={<Navigate to={login} replace />} />
                <Route path="/auth/super-admin/login" element={loginPage} />
                {/* PrivateRoute falls back to the admin login for paths without a known
                    role segment (e.g. /app/super-admin/*), so serve this portal's login. */}
                <Route path="/auth/admin/login" element={loginPage} />

                {/* Document / clean-URL aliases: /student.html, /student, /app/student */}
                <Route path={`/${slug}.html`} element={<Navigate to={home} replace />} />
                <Route path={`/${slug}`} element={<Navigate to={home} replace />} />
                <Route path={`/app/${slug}`} element={<Navigate to={home} replace />} />
                <Route path="/app" element={<Navigate to={home} replace />} />
                <Route path="/" element={<Navigate to={home} replace />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Guarded portal routes */}
                <Route element={<PrivateRoute allowedRoles={Object.values(ROLES)} />}>
                  <Route element={<MainLayout />}>
                    <Route element={<PrivateRoute allowedRoles={allowedRoles} />}>
                      <Route path={`/app/${slug}/*`} element={routes} />
                    </Route>
                  </Route>
                </Route>

                {/* Unknown paths land on this portal's dashboard (guards handle auth/roles). */}
                <Route path="*" element={<Navigate to={home} replace />} />
              </Routes>
            </Router>
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}
