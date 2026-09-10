import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from './store/slices/authSlice';
import { ROLES } from './common/utils/roleRouting';
import { ROLE_NAVIGATION } from './common/layout/navigationConfig';
import PrivateRoute from './common/components/PrivateRoute/PrivateRoute';
import Navbar from './common/layout/Navbar';
import Sidebar from './common/layout/Sidebar';
import Unauthorized from './common/components/Unauthorized/Unauthorized';
import LoginPage from './roles/public/pages/Login';

const SuperAdminDashboard = lazy(() => import('./roles/super-admin/pages/Dashboard'));
const AdminDashboard = lazy(() => import('./roles/admin/pages/Dashboard'));
const HRDashboard = lazy(() => import('./roles/hr/pages/Dashboard'));
const TutorDashboard = lazy(() => import('./roles/tutor/pages/Dashboard'));
const PMDashboard = lazy(() => import('./roles/project-manager/pages/Dashboard'));
const FinanceDashboard = lazy(() => import('./roles/finance/pages/Dashboard'));
const SalesDashboard = lazy(() => import('./roles/sales/pages/Dashboard'));
const ReceptionDashboard = lazy(() => import('./roles/reception/pages/Dashboard'));
const EmployeeDashboard = lazy(() => import('./roles/employee/pages/Dashboard'));
const StudentDashboard = lazy(() => import('./roles/student/pages/Dashboard'));
const InternDashboard = lazy(() => import('./roles/intern/pages/Dashboard'));

const ROLE_DASHBOARD_MAP = {
  SUPER_ADMIN: SuperAdminDashboard,
  ADMIN: AdminDashboard,
  HR: HRDashboard,
  TUTOR: TutorDashboard,
  PROJECT_MANAGER: PMDashboard,
  FINANCE: FinanceDashboard,
  SALES: SalesDashboard,
  RECEPTION: ReceptionDashboard,
  EMPLOYEE: EmployeeDashboard,
  STUDENT: StudentDashboard,
  INTERN: InternDashboard,
};

function LoadingSpinner() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

function RoleLayout() {
  const user = useSelector(selectCurrentUser);
  const location = useLocation();

  if (!user || !user.role) {
    return <Navigate to="/auth/login" replace />;
  }

  const navItems = ROLE_NAVIGATION[user.role] || [];
  const DashboardComponent = ROLE_DASHBOARD_MAP[user.role];

  const matchedRoute = navItems.find((item) => {
    if (!item.path) return false;
    return location.pathname === item.path || location.pathname.startsWith(item.path + '/');
  });

  const pageTitle = matchedRoute ? matchedRoute.label : 'Dashboard';

  return (
    <div className="d-flex vh-100 overflow-hidden">
      <Sidebar role={user.role} navItems={navItems} />
      <div className="flex-grow-1 d-flex flex-column">
        <Navbar role={user.role} />
        <main className="flex-grow-1 overflow-auto p-4 bg-light">
          <div className="container-fluid">
            <h4 className="mb-4">{pageTitle}</h4>
            <Suspense fallback={<LoadingSpinner />}>
              {DashboardComponent ? <DashboardComponent /> : <Navigate to="/unauthorized" replace />}
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/auth/:role/login" element={<LoginPage />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route
        path="/app/:role/*"
        element={
          <PrivateRoute>
            <RoleLayout />
          </PrivateRoute>
        }
      />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/" element={<Navigate to="/auth/login" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function NotFound() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <h1 className="display-1 text-muted">404</h1>
        <h2 className="text-muted">Page Not Found</h2>
        <p className="lead text-muted">The page you are looking for does not exist.</p>
      </div>
    </div>
  );
}

export default App;