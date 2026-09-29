import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/index.js";
import { AuthProvider } from "./common/contexts/AuthContext.jsx";
import { SocketProvider } from "./common/contexts/SocketContext.jsx";
import { ThemeProvider } from "./common/contexts/ThemeContext.jsx";
import PrivateRoute from "./common/components/PrivateRoute/PrivateRoute.jsx";
import RoleRedirect from "./common/components/RoleRedirect/RoleRedirect.jsx";
import MainLayout from "./common/layout/MainLayout.jsx";
import { ROLES } from "./common/utils/roleRouting.js";
import LoginPage from "./auth/pages/LoginPage.jsx";
import AdminLoginPage from "./auth/pages/AdminLoginPage.jsx";
import SuperAdminLoginPage from "./auth/portals/pages/SuperAdminLoginPage.jsx";
import HrLoginPage from "./auth/portals/pages/HrLoginPage.jsx";
import TutorLoginPage from "./auth/portals/pages/TutorLoginPage.jsx";
import PmLoginPage from "./auth/portals/pages/PmLoginPage.jsx";
import FinanceLoginPage from "./auth/portals/pages/FinanceLoginPage.jsx";
import SalesLoginPage from "./auth/portals/pages/SalesLoginPage.jsx";
import ReceptionLoginPage from "./auth/portals/pages/ReceptionLoginPage.jsx";
import EmployeeLoginPage from "./auth/portals/pages/EmployeeLoginPage.jsx";
import StudentLoginPage from "./auth/portals/pages/StudentLoginPage.jsx";
import InternLoginPage from "./auth/portals/pages/InternLoginPage.jsx";
import StudentRoutes from "./roles/student/StudentRoutes.jsx";
import TutorRoutes from "./roles/tutor/TutorRoutes.jsx";
import HRRoutes from "./roles/hr/HRApp.jsx";
import PmRoutes from "./roles/project-manager/PmRoutes.jsx";
import FinanceRoutes from "./roles/finance/FinanceRoutes.jsx";
import SalesRoutes from "./roles/sales/SalesRoutes.jsx";
import ReceptionRoutes from "./roles/reception/ReceptionRoutes.jsx";
import EmployeeRoutes from "./roles/employee/EmployeeRoutes.jsx";
import SuperAdminRoutes from "./roles/super-admin/SuperAdminApp.jsx";
import AdminRoutes from "./roles/admin/AdminRoutes.jsx";
import InternApp from "./roles/intern/InternApp.jsx";
import PublicCourseCatalogPage from "./roles/public/pages/CourseCatalog.jsx";
import PublicCourseDetailPage from "./roles/public/pages/CourseDetail.jsx";
import PublicCheckoutPage from "./roles/public/pages/Checkout.jsx";
import DynamicCalendar from "./pages/DynamicCalendar.jsx";

export default function AdminApp() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <Routes>
                <Route path="/marketplace/catalog" element={<PublicCourseCatalogPage />} />
                <Route path="/marketplace/course/:id" element={<PublicCourseDetailPage />} />
                <Route path="/marketplace/checkout" element={<PublicCheckoutPage />} />
                <Route path="/app/login" element={<LoginPage />} />
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/auth/admin/login" element={<AdminLoginPage />} />
                <Route path="/login" element={<Navigate to="/app/login" replace />} />
                <Route path="/auth/login" element={<Navigate to="/app/login" replace />} />
                <Route path="/auth/super-admin/login" element={<SuperAdminLoginPage />} />
                <Route path="/auth/hr/login" element={<HrLoginPage />} />
                <Route path="/auth/tutor/login" element={<TutorLoginPage />} />
                <Route path="/auth/pm/login" element={<PmLoginPage />} />
                <Route path="/auth/finance/login" element={<FinanceLoginPage />} />
                <Route path="/auth/sales/login" element={<SalesLoginPage />} />
                <Route path="/auth/reception/login" element={<ReceptionLoginPage />} />
                <Route path="/auth/employee/login" element={<EmployeeLoginPage />} />
                <Route path="/employee/login" element={<EmployeeLoginPage />} />
                <Route path="/app/employee/login" element={<EmployeeLoginPage />} />
                <Route path="/auth/student/login" element={<StudentLoginPage />} />
                <Route path="/student/login" element={<StudentLoginPage />} />
                <Route path="/app/student/login" element={<StudentLoginPage />} />
                <Route path="/auth/intern/login" element={<InternLoginPage />} />
                <Route path="/intern/login" element={<InternLoginPage />} />
                <Route path="/app/intern/login" element={<InternLoginPage />} />
                <Route path="/student.html" element={<Navigate to="/auth/student/login" replace />} />
                <Route path="/student" element={<Navigate to="/app/student/dashboard" replace />} />
                <Route path="/app/student" element={<Navigate to="/app/student/dashboard" replace />} />
                <Route path="/employee.html" element={<Navigate to="/auth/employee/login" replace />} />
                <Route path="/employee" element={<Navigate to="/app/employee/dashboard" replace />} />
                <Route path="/app/employee" element={<Navigate to="/app/employee/dashboard" replace />} />
                <Route path="/reception.html" element={<Navigate to="/app/reception/dashboard" replace />} />
                <Route path="/reception" element={<Navigate to="/app/reception/dashboard" replace />} />
                <Route path="/sales.html" element={<Navigate to="/app/sales/dashboard" replace />} />
                <Route path="/sales" element={<Navigate to="/app/sales/dashboard" replace />} />
                <Route path="/intern.html" element={<Navigate to="/app/intern/dashboard" replace />} />
                <Route path="/intern" element={<Navigate to="/app/intern/dashboard" replace />} />
                <Route path="/app/intern" element={<Navigate to="/app/intern/dashboard" replace />} />
                <Route path="/hr.html" element={<Navigate to="/app/hr/dashboard" replace />} />
                <Route path="/hr" element={<Navigate to="/app/hr/dashboard" replace />} />
                <Route path="/app/hr" element={<Navigate to="/app/hr/dashboard" replace />} />
                <Route path="/admin.html" element={<Navigate to="/app/admin/dashboard" replace />} />
                <Route path="/app/admin" element={<Navigate to="/app/admin/dashboard" replace />} />
                <Route path="/super-admin.html" element={<Navigate to="/app/super-admin/dashboard" replace />} />
                <Route path="/super-admin" element={<Navigate to="/app/super-admin/dashboard" replace />} />
                <Route path="/app/super-admin" element={<Navigate to="/app/super-admin/dashboard" replace />} />
                <Route path="/app" element={<RoleRedirect />} />
                <Route path="/admin" element={<RoleRedirect />} />
                <Route path="/" element={<RoleRedirect />} />
                <Route element={<PrivateRoute allowedRoles={Object.values(ROLES)} />}>
                  <Route element={<MainLayout />}>
                    <Route element={<PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN]} />}>
                      {/* Cross-portal shared calendar lives outside the super-admin URL space. */}
                      <Route path="/app/calendar" element={<DynamicCalendar />} />
                      <Route path="/app/super-admin/*" element={<SuperAdminRoutes />} />
                    </Route>
                    <Route element={<PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN]} />}>
                      <Route path="/app/admin/*" element={<AdminRoutes />} />
                    </Route>
                    <Route element={<PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR]} />}>
                      <Route path="/app/hr/*" element={<HRRoutes />} />
                    </Route>
                    <Route element={<PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TUTOR]} />}>
                      <Route path="/app/tutor/*" element={<TutorRoutes />} />
                    </Route>
                    <Route element={<PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.PROJECT_MANAGER]} />}>
                      <Route path="/app/pm/*" element={<PmRoutes />} />
                    </Route>
                    <Route element={<PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.FINANCE]} />}>
                      <Route path="/app/finance/*" element={<FinanceRoutes />} />
                    </Route>
                    <Route element={<PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.SALES]} />}>
                      <Route path="/app/sales/*" element={<SalesRoutes />} />
                    </Route>
                    <Route element={<PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.RECEPTION]} />}>
                      <Route path="/app/reception/*" element={<ReceptionRoutes />} />
                    </Route>
                    <Route element={<PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EMPLOYEE]} />}>
                      <Route path="/app/employee/*" element={<EmployeeRoutes />} />
                    </Route>
                    <Route element={<PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.STUDENT]} />}>
                      <Route path="/app/student/*" element={<StudentRoutes />} />
                    </Route>
                    <Route element={<PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.INTERN]} />}>
                      <Route path="/app/intern/*" element={<InternApp />} />
                    </Route>
                  </Route>
                </Route>
                <Route path="*" element={<RoleRedirect />} />
              </Routes>
            </Router>
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}
