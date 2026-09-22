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
import HrLoginPage from "./auth/portals/pages/HrLoginPage.jsx";
import {
  HRDashboard,
  HREmployees,
  HRInterns,
  HRAttendance,
  HRLeaves,
  HRInterviews,
  HRCommunications as CommunicationsPage,
  HRPayroll,
  HRPerformance,
  HRJobsBoard,
  HROnboarding,
  HRTraining,
  HRDocuments,
  HRReports,
  HROffboarding,
  HRCareerApplications,
  HRInquiries
} from "./roles/hr/index.js";

export default function HRApp() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <Routes>
                {/* HR Login Route */}
                <Route path="/auth/hr/login" element={<HrLoginPage />} />
                {/* PrivateRoute uses the shared login path. Keep this portal self-contained. */}
                <Route path="/auth/login" element={<Navigate to="/auth/hr/login" replace />} />
                <Route path="/hr/login" element={<Navigate to="/auth/hr/login" replace />} />
                <Route path="/hr.html" element={<Navigate to="/app/hr/dashboard" replace />} />
                <Route path="/hr" element={<Navigate to="/app/hr/dashboard" replace />} />
                <Route path="/app/hr" element={<Navigate to="/app/hr/dashboard" replace />} />
                <Route path="/app" element={<RoleRedirect />} />
                {/* HR Protected Routes */}
                <Route element={<PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR]} />}>
                  <Route element={<MainLayout />}>
                    {/* HR Dashboard & Core Operations */}
                    <Route path="/app/hr/dashboard" element={<HRDashboard />} />
                    <Route path="/app/hr/applications" element={<HRCareerApplications />} />
                    <Route path="/app/hr/inquiries" element={<HRInquiries />} />
                    <Route path="/app/hr/employees" element={<HREmployees />} />
                    <Route path="/app/hr/interns" element={<HRInterns />} />
                    <Route path="/app/hr/onboarding" element={<HROnboarding />} />
                    <Route path="/app/hr/attendance" element={<HRAttendance />} />
                    <Route path="/app/hr/leaves" element={<HRLeaves />} />
                    <Route path="/app/hr/interviews" element={<HRInterviews />} />
                    <Route path="/app/hr/training" element={<HRTraining />} />
                    <Route path="/app/hr/communications" element={<CommunicationsPage />} />
                    <Route path="/app/hr/announcements" element={<CommunicationsPage />} />
                    <Route path="/app/hr/payroll" element={<HRPayroll />} />
                    <Route path="/app/hr/performance" element={<HRPerformance />} />
                    <Route path="/app/hr/jobs-board" element={<HRJobsBoard />} />
                    <Route path="/app/hr/documents" element={<HRDocuments />} />
                    <Route path="/app/hr/reports" element={<HRReports />} />
                    <Route path="/app/hr/offboarding" element={<HROffboarding />} />
                    <Route path="/app/hr/exit-offboarding" element={<HROffboarding />} />
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
