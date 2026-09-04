import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/index.js';
import { AuthProvider } from './common/contexts/AuthContext.jsx';
import { SocketProvider } from './common/contexts/SocketContext.jsx';
import { ThemeProvider } from './common/contexts/ThemeContext.jsx';
import PrivateRoute from './common/components/PrivateRoute/PrivateRoute.jsx';
import MainLayout from './common/layout/MainLayout.jsx';

import LoginPage from './auth/pages/LoginPage.jsx';
import Dashboard from './roles/super-admin/pages/Dashboard.jsx';
import Users from './roles/super-admin/pages/Users.jsx';
import Leads from './roles/super-admin/pages/Leads.jsx';
import AuditLogs from './roles/super-admin/pages/AuditLogs.jsx';
import Settings from './roles/super-admin/pages/Settings.jsx';

// HR Role Pages
import HRDashboard from './roles/hr/pages/Dashboard.jsx';
import HREmployees from './roles/hr/pages/Employees.jsx';
import HRInterns from './roles/hr/pages/Interns.jsx';
import HRAttendance from './roles/hr/pages/Attendance.jsx';
import HRLeaves from './roles/hr/pages/Leaves.jsx';
import HRInterviews from './roles/hr/pages/Interviews.jsx';
import CommunicationsPage from './roles/hr/pages/Communications.jsx';
import HRPayroll from './roles/hr/pages/Payroll.jsx';
import HRPerformance from './roles/hr/pages/Performance.jsx';
import HRJobsBoard from './roles/hr/pages/JobsBoard.jsx';

// Tutor Role Pages
import TutorDashboard from './roles/tutor/pages/Dashboard.jsx';
import TutorCourses from './roles/tutor/pages/Courses.jsx';
import TutorCurriculum from './roles/tutor/pages/CourseCurriculum.jsx';
import TutorStudents from './roles/tutor/pages/Students.jsx';

// PM Role Pages
import PMDashboard from './roles/project-manager/pages/Dashboard.jsx';
import PMClients from './roles/project-manager/pages/Clients.jsx';
import PMSubscriptions from './roles/project-manager/pages/Subscriptions.jsx';
import PMTasks from './roles/project-manager/pages/Tasks.jsx';
import PMCompanySettings from './roles/project-manager/pages/CompanySettings.jsx';

// Student Role Pages
import StudentDashboard from './roles/student/pages/Dashboard.jsx';
import StudentCourses from './roles/student/pages/Courses.jsx';
import StudentCoursePlayer from './roles/student/pages/CoursePlayer.jsx';
import StudentLiveQuiz from './roles/student/pages/LiveQuiz.jsx';
import StudentForum from './roles/student/pages/Forum.jsx';
import StudentProfile from './roles/student/pages/Profile.jsx';
import StudentProjects from './roles/student/pages/Projects.jsx';
import StudentMindMap from './roles/student/pages/MindMap.jsx';
import StudentCertificates from './roles/student/pages/Certificates.jsx';

// Employee Role Pages
import EmployeeDashboard from './roles/employee/pages/Dashboard.jsx';
import EmployeeLeaves from './roles/employee/pages/Leaves.jsx';
import EmployeePayslips from './roles/employee/pages/Payslips.jsx';
import EmployeePerformance from './roles/employee/pages/Performance.jsx';

// Intern Role Pages
import InternDashboard from './roles/intern/pages/Dashboard.jsx';

// Finance Role Pages
import FinanceDashboard from './roles/finance/pages/Dashboard.jsx';
import FinanceIncome from './roles/finance/pages/Income.jsx';
import FinanceExpenses from './roles/finance/pages/Expenses.jsx';
import FinanceInvoices from './roles/finance/pages/Invoices.jsx';
import FinancePayments from './roles/finance/pages/Payments.jsx';
import FinanceSchedules from './roles/finance/pages/Schedules.jsx';
import FinancePayroll from './roles/finance/pages/Payroll.jsx';

// Gamification Page definitions
import SuperAdminGamification from './roles/super-admin/pages/Gamification.jsx';
import AdminGamification from './roles/admin/pages/Gamification.jsx';

// Integration Page definitions
import SuperAdminIntegrations from './roles/super-admin/pages/Integrations.jsx';
import AdminIntegrations from './roles/admin/pages/Integrations.jsx';

// Phase 5 Page definitions
import SuperAdminApprovals from './roles/super-admin/pages/Approvals.jsx';
import SuperAdminCalendar from './roles/super-admin/pages/Calendar.jsx';
import AdminApprovals from './roles/admin/pages/Approvals.jsx';
import AdminCalendar from './roles/admin/pages/Calendar.jsx';

// Phase 6 Page definitions
import SuperAdminMonitoring from './roles/super-admin/pages/Monitoring.jsx';
import SuperAdminJobsBoard from './roles/super-admin/pages/JobsBoard.jsx';
import AdminMonitoring from './roles/admin/pages/Monitoring.jsx';
import AdminJobsBoard from './roles/admin/pages/JobsBoard.jsx';

// Phase 7 Page definitions
import SuperAdminTenants from './roles/super-admin/pages/Tenants.jsx';
import AdminMarketplace from './roles/admin/pages/Marketplace.jsx';
import AdminReports from './roles/admin/pages/Reports.jsx';
import AdminDeveloperPortal from './roles/admin/pages/DeveloperPortal.jsx';
import PublicCourseCatalogPage from './roles/public/pages/CourseCatalog.jsx';
import PublicCourseDetailPage from './roles/public/pages/CourseDetail.jsx';
import PublicCheckoutPage from './roles/public/pages/Checkout.jsx';

// Phase 8 Page definitions
import SuperAdminSystemSearch from './roles/super-admin/pages/SystemSearch.jsx';
import AdminAutomationStudio from './roles/admin/pages/AutomationStudio.jsx';
import AdminAIAnalytics from './roles/admin/pages/AIAnalytics.jsx';

export default function AdminApp() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <Router>
              <Routes>
                {/* Public Checkout / Marketplace Routes */}
                <Route path="/marketplace/catalog" element={<PublicCourseCatalogPage />} />
                <Route path="/marketplace/course/:id" element={<PublicCourseDetailPage />} />
                <Route path="/marketplace/checkout" element={<PublicCheckoutPage />} />

                {/* Public Route */}
                <Route path="/admin/login" element={<LoginPage />} />
                <Route path="/login" element={<Navigate to="/admin/login" replace />} />

                {/* Private App Routes */}
                <Route element={<PrivateRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'SALES', 'HR', 'TUTOR', 'PROJECT_MANAGER', 'STUDENT', 'EMPLOYEE', 'INTERN', 'FINANCE']} />}>
                  <Route element={<MainLayout />}>
                    
                    {/* Fallback Role Dashboards */}
                    <Route path="/admin/dashboard" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
                    
                    {/* CRM Leads (All authenticated roles) */}
                    <Route path="/admin/leads" element={<Leads />} />
                    <Route path="/leads" element={<Navigate to="/admin/leads" replace />} />
                    
                    {/* Admin Restricted Routes */}
                    <Route element={<PrivateRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']} />}>
                      <Route path="/admin/users" element={<Users />} />
                      <Route path="/users" element={<Navigate to="/admin/users" replace />} />
                      <Route path="/admin/audit-logs" element={<AuditLogs />} />
                      <Route path="/audit-logs" element={<Navigate to="/admin/audit-logs" replace />} />
                      <Route path="/admin/gamification" element={<AdminGamification />} />
                      <Route path="/admin/integrations" element={<AdminIntegrations />} />
                      <Route path="/admin/approvals" element={<AdminApprovals />} />
                      <Route path="/admin/calendar" element={<AdminCalendar />} />
                      <Route path="/admin/monitoring" element={<AdminMonitoring />} />
                      <Route path="/admin/jobs-board" element={<AdminJobsBoard />} />
                      <Route path="/admin/marketplace" element={<AdminMarketplace />} />
                      <Route path="/admin/reports" element={<AdminReports />} />
                      <Route path="/admin/developer" element={<AdminDeveloperPortal />} />
                      <Route path="/admin/automation" element={<AdminAutomationStudio />} />
                      <Route path="/admin/analytics" element={<AdminAIAnalytics />} />
                    </Route>

                    {/* Super Admin Restricted Routes */}
                    <Route element={<PrivateRoute allowedRoles={['SUPER_ADMIN']} />}>
                      <Route path="/admin/settings" element={<Settings />} />
                      <Route path="/settings" element={<Navigate to="/admin/settings" replace />} />
                      <Route path="/admin/super-gamification" element={<SuperAdminGamification />} />
                      <Route path="/admin/super-integrations" element={<SuperAdminIntegrations />} />
                      <Route path="/admin/super-approvals" element={<SuperAdminApprovals />} />
                      <Route path="/admin/super-calendar" element={<SuperAdminCalendar />} />
                      <Route path="/admin/super-monitoring" element={<SuperAdminMonitoring />} />
                      <Route path="/admin/super-jobs-board" element={<SuperAdminJobsBoard />} />
                      <Route path="/admin/super-tenants" element={<SuperAdminTenants />} />
                      <Route path="/admin/super-search" element={<SuperAdminSystemSearch />} />
                    </Route>

                    {/* HR Role Routes */}
                    <Route element={<PrivateRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'HR']} />}>
                      <Route path="/admin/hr/dashboard" element={<HRDashboard />} />
                      <Route path="/admin/hr/employees" element={<HREmployees />} />
                      <Route path="/admin/hr/interns" element={<HRInterns />} />
                      <Route path="/admin/hr/attendance" element={<HRAttendance />} />
                      <Route path="/admin/hr/leaves" element={<HRLeaves />} />
                      <Route path="/admin/hr/interviews" element={<HRInterviews />} />
                      <Route path="/admin/hr/communications" element={<CommunicationsPage />} />
                      <Route path="/admin/hr/payroll" element={<HRPayroll />} />
                      <Route path="/admin/hr/performance" element={<HRPerformance />} />
                      <Route path="/admin/hr/jobs-board" element={<HRJobsBoard />} />
                    </Route>

                    {/* Tutor Role Routes */}
                    <Route element={<PrivateRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'TUTOR']} />}>
                      <Route path="/admin/tutor/dashboard" element={<TutorDashboard />} />
                      <Route path="/admin/tutor/courses" element={<TutorCourses />} />
                      <Route path="/admin/tutor/curriculum" element={<TutorCurriculum />} />
                      <Route path="/admin/tutor/students" element={<TutorStudents />} />
                    </Route>

                    {/* PM Role Routes */}
                    <Route element={<PrivateRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'PROJECT_MANAGER']} />}>
                      <Route path="/admin/pm/dashboard" element={<PMDashboard />} />
                      <Route path="/admin/pm/clients" element={<PMClients />} />
                      <Route path="/admin/pm/subscriptions" element={<PMSubscriptions />} />
                      <Route path="/admin/pm/tasks" element={<PMTasks />} />
                      <Route path="/admin/pm/settings" element={<PMCompanySettings />} />
                    </Route>

                    {/* Student Role Routes */}
                    <Route element={<PrivateRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'STUDENT']} />}>
                      <Route path="/admin/student/dashboard" element={<StudentDashboard />} />
                      <Route path="/admin/student/courses" element={<StudentCourses />} />
                      <Route path="/admin/student/player" element={<StudentCoursePlayer />} />
                      <Route path="/admin/student/live-quiz" element={<StudentLiveQuiz />} />
                      <Route path="/admin/student/forum" element={<StudentForum />} />
                      <Route path="/admin/student/profile" element={<StudentProfile />} />
                      <Route path="/admin/student/projects" element={<StudentProjects />} />
                      <Route path="/admin/student/mindmap" element={<StudentMindMap />} />
                      <Route path="/admin/student/certificates" element={<StudentCertificates />} />
                    </Route>

                    {/* Employee Role Routes */}
                    <Route element={<PrivateRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'EMPLOYEE']} />}>
                      <Route path="/admin/employee/dashboard" element={<EmployeeDashboard />} />
                      <Route path="/admin/employee/leaves" element={<EmployeeLeaves />} />
                      <Route path="/admin/employee/payslips" element={<EmployeePayslips />} />
                      <Route path="/admin/employee/performance" element={<EmployeePerformance />} />
                    </Route>

                    {/* Intern Role Routes */}
                    <Route element={<PrivateRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'INTERN']} />}>
                      <Route path="/admin/intern/dashboard" element={<InternDashboard />} />
                    </Route>

                    {/* Finance Role Routes */}
                    <Route element={<PrivateRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'FINANCE']} />}>
                      <Route path="/admin/finance/dashboard" element={<FinanceDashboard />} />
                      <Route path="/admin/finance/income" element={<FinanceIncome />} />
                      <Route path="/admin/finance/expenses" element={<FinanceExpenses />} />
                      <Route path="/admin/finance/invoices" element={<FinanceInvoices />} />
                      <Route path="/admin/finance/payments" element={<FinancePayments />} />
                      <Route path="/admin/finance/schedules" element={<FinanceSchedules />} />
                      <Route path="/admin/finance/payroll" element={<FinancePayroll />} />
                    </Route>

                    {/* Default Catch-all */}
                    <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                  </Route>
                </Route>

                {/* Default root Redirect */}
                <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
              </Routes>
            </Router>
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}