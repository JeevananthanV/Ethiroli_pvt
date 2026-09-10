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
import Dashboard from "./roles/super-admin/pages/Dashboard.jsx";
import Users from "./roles/super-admin/pages/Users.jsx";
import Leads from "./roles/super-admin/pages/Leads.jsx";
import AuditLogs from "./roles/super-admin/pages/AuditLogs.jsx";
import Settings from "./roles/super-admin/pages/Settings.jsx";
import HRDashboard from "./roles/hr/pages/Dashboard.jsx";
import HREmployees from "./roles/hr/pages/Employees.jsx";
import HRInterns from "./roles/hr/pages/Interns.jsx";
import HRAttendance from "./roles/hr/pages/Attendance.jsx";
import HRLeaves from "./roles/hr/pages/Leaves.jsx";
import HRInterviews from "./roles/hr/pages/Interviews.jsx";
import CommunicationsPage from "./roles/hr/pages/Communications.jsx";
import HRPayroll from "./roles/hr/pages/Payroll.jsx";
import HRPerformance from "./roles/hr/pages/Performance.jsx";
import HRJobsBoard from "./roles/hr/pages/JobsBoard.jsx";
import TutorDashboard from "./roles/tutor/pages/Dashboard.jsx";
import TutorCourses from "./roles/tutor/pages/Courses.jsx";
import TutorCurriculum from "./roles/tutor/pages/CourseCurriculum.jsx";
import TutorStudents from "./roles/tutor/pages/Students.jsx";
import PMDashboard from "./roles/project-manager/pages/Dashboard.jsx";
import PMClients from "./roles/project-manager/pages/Clients.jsx";
import PMSubscriptions from "./roles/project-manager/pages/Subscriptions.jsx";
import PMTasks from "./roles/project-manager/pages/Tasks.jsx";
import PMCompanySettings from "./roles/project-manager/pages/CompanySettings.jsx";
import StudentDashboard from "./roles/student/pages/Dashboard.jsx";
import StudentCourses from "./roles/student/pages/Courses.jsx";
import StudentCoursePlayer from "./roles/student/pages/CoursePlayer.jsx";
import StudentLiveQuiz from "./roles/student/pages/LiveQuiz.jsx";
import StudentForum from "./roles/student/pages/Forum.jsx";
import StudentProfile from "./roles/student/pages/Profile.jsx";
import StudentProjects from "./roles/student/pages/Projects.jsx";
import StudentMindMap from "./roles/student/pages/MindMap.jsx";
import StudentCertificates from "./roles/student/pages/Certificates.jsx";
import EmployeeDashboard from "./roles/employee/pages/Dashboard.jsx";
import EmployeeLeaves from "./roles/employee/pages/Leaves.jsx";
import EmployeePayslips from "./roles/employee/pages/Payslips.jsx";
import EmployeePerformance from "./roles/employee/pages/Performance.jsx";
import InternDashboard from "./roles/intern/pages/Dashboard.jsx";
import FinanceDashboard from "./roles/finance/pages/Dashboard.jsx";
import FinanceIncome from "./roles/finance/pages/Income.jsx";
import FinanceExpenses from "./roles/finance/pages/Expenses.jsx";
import FinanceInvoices from "./roles/finance/pages/Invoices.jsx";
import FinancePayments from "./roles/finance/pages/Payments.jsx";
import FinanceSchedules from "./roles/finance/pages/Schedules.jsx";
import FinancePayroll from "./roles/finance/pages/Payroll.jsx";
import SalesDashboard from "./roles/sales/pages/Dashboard.jsx";
import SalesLeads from "./roles/sales/pages/Leads.jsx";
import SalesFollowUps from "./roles/sales/pages/FollowUps.jsx";
import ReceptionDashboard from "./roles/reception/pages/Dashboard.jsx";
import ReceptionAttendance from "./roles/reception/pages/Attendance.jsx";
import ReceptionCalendar from "./roles/reception/pages/Calendar.jsx";
import ReceptionCommunications from "./roles/reception/pages/Communications.jsx";
import SuperAdminGamification from "./roles/super-admin/pages/Gamification.jsx";
import AdminGamification from "./roles/admin/pages/Gamification.jsx";
import SuperAdminIntegrations from "./roles/super-admin/pages/Integrations.jsx";
import AdminIntegrations from "./roles/admin/pages/Integrations.jsx";
import SuperAdminApprovals from "./roles/super-admin/pages/Approvals.jsx";
import SuperAdminCalendar from "./roles/super-admin/pages/Calendar.jsx";
import AdminApprovals from "./roles/admin/pages/Approvals.jsx";
import AdminCalendar from "./roles/admin/pages/Calendar.jsx";
import SuperAdminMonitoring from "./roles/super-admin/pages/Monitoring.jsx";
import SuperAdminJobsBoard from "./roles/super-admin/pages/JobsBoard.jsx";
import AdminMonitoring from "./roles/admin/pages/Monitoring.jsx";
import AdminJobsBoard from "./roles/admin/pages/JobsBoard.jsx";
import SuperAdminTenants from "./roles/super-admin/pages/Tenants.jsx";
import AdminMarketplace from "./roles/admin/pages/Marketplace.jsx";
import AdminReports from "./roles/admin/pages/Reports.jsx";
import AdminDeveloperPortal from "./roles/admin/pages/DeveloperPortal.jsx";
import PublicCourseCatalogPage from "./roles/public/pages/CourseCatalog.jsx";
import PublicCourseDetailPage from "./roles/public/pages/CourseDetail.jsx";
import PublicCheckoutPage from "./roles/public/pages/Checkout.jsx";
import SuperAdminSystemSearch from "./roles/super-admin/pages/SystemSearch.jsx";
import AdminAutomationStudio from "./roles/admin/pages/AutomationStudio.jsx";
import AdminAIAnalytics from "./roles/admin/pages/AIAnalytics.jsx";
import EmployeeTasks from "./roles/employee/pages/Tasks.jsx";
import EmployeeCalendar from "./roles/employee/pages/Calendar.jsx";
import EmployeeApprovals from "./roles/employee/pages/Approvals.jsx";
import StudentQuiz from "./roles/student/pages/Quiz.jsx";
import InternTasks from "./roles/intern/pages/Tasks.jsx";
import InternProjects from "./roles/intern/pages/Projects.jsx";
import InternCalendar from "./roles/intern/pages/Calendar.jsx";
import PMApprovals from "./roles/project-manager/pages/Approvals.jsx";
import PMCalendar from "./roles/project-manager/pages/Calendar.jsx";
import TutorForum from "./roles/tutor/pages/Forum.jsx";
import TutorCommunications from "./roles/tutor/pages/Communications.jsx";

export default function AdminApp() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <Router>
              <Routes>
                <Route path="/marketplace/catalog" element={<PublicCourseCatalogPage />} />
                <Route path="/marketplace/course/:id" element={<PublicCourseDetailPage />} />
                <Route path="/marketplace/checkout" element={<PublicCheckoutPage />} />
                <Route path="/app/login" element={<LoginPage />} />
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/login" element={<Navigate to="/app/login" replace />} />
                <Route path="/auth/super-admin/login" element={<SuperAdminLoginPage />} />
                <Route path="/auth/hr/login" element={<HrLoginPage />} />
                <Route path="/auth/tutor/login" element={<TutorLoginPage />} />
                <Route path="/auth/pm/login" element={<PmLoginPage />} />
                <Route path="/auth/finance/login" element={<FinanceLoginPage />} />
                <Route path="/auth/sales/login" element={<SalesLoginPage />} />
                <Route path="/auth/reception/login" element={<ReceptionLoginPage />} />
                <Route path="/auth/employee/login" element={<EmployeeLoginPage />} />
                <Route path="/auth/student/login" element={<StudentLoginPage />} />
                <Route path="/auth/intern/login" element={<InternLoginPage />} />
                <Route path="/app" element={<RoleRedirect />} />
                <Route path="/admin" element={<RoleRedirect />} />
                <Route path="*" element={<RoleRedirect />} />
                <Route element={<PrivateRoute allowedRoles={Object.values(ROLES)} />}>
                  <Route element={<MainLayout />}>
                    <Route element={<PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN]} />}>
                      <Route path="/app/super-admin/dashboard" element={<Dashboard />} />
                      <Route path="/app/super-admin/users" element={<Users />} />
                      <Route path="/app/super-admin/leads" element={<Leads />} />
                      <Route path="/app/super-admin/audit-logs" element={<AuditLogs />} />
                      <Route path="/app/super-admin/settings" element={<Settings />} />
                      <Route path="/app/super-admin/tenants" element={<SuperAdminTenants />} />
                      <Route path="/app/super-admin/monitoring" element={<SuperAdminMonitoring />} />
                      <Route path="/app/super-admin/system-search" element={<SuperAdminSystemSearch />} />
                      <Route path="/app/super-admin/approvals" element={<SuperAdminApprovals />} />
                      <Route path="/app/super-admin/super-approvals" element={<SuperAdminApprovals />} />
                      <Route path="/app/super-admin/calendar" element={<SuperAdminCalendar />} />
                      <Route path="/app/super-admin/super-calendar" element={<SuperAdminCalendar />} />
                      <Route path="/app/super-admin/jobs-board" element={<SuperAdminJobsBoard />} />
                      <Route path="/app/super-admin/super-jobs-board" element={<SuperAdminJobsBoard />} />
                      <Route path="/app/super-admin/gamification" element={<SuperAdminGamification />} />
                      <Route path="/app/super-admin/super-gamification" element={<SuperAdminGamification />} />
                      <Route path="/app/super-admin/integrations" element={<SuperAdminIntegrations />} />
                      <Route path="/app/super-admin/super-integrations" element={<SuperAdminIntegrations />} />
                    </Route>
                    <Route element={<PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN]} />}>
                      <Route path="/app/admin/dashboard" element={<Dashboard />} />
                      <Route path="/app/admin/users" element={<Users />} />
                      <Route path="/app/admin/leads" element={<Leads />} />
                      <Route path="/app/admin/audit-logs" element={<AuditLogs />} />
                      <Route path="/app/admin/gamification" element={<AdminGamification />} />
                      <Route path="/app/admin/integrations" element={<AdminIntegrations />} />
                      <Route path="/app/admin/approvals" element={<AdminApprovals />} />
                      <Route path="/app/admin/calendar" element={<AdminCalendar />} />
                      <Route path="/app/admin/monitoring" element={<AdminMonitoring />} />
                      <Route path="/app/admin/jobs-board" element={<AdminJobsBoard />} />
                      <Route path="/app/admin/marketplace" element={<AdminMarketplace />} />
                      <Route path="/app/admin/reports" element={<AdminReports />} />
                      <Route path="/app/admin/automation" element={<AdminAutomationStudio />} />
                      <Route path="/app/admin/analytics" element={<AdminAIAnalytics />} />
                      <Route path="/app/admin/developer" element={<AdminDeveloperPortal />} />
                    </Route>
                    <Route element={<PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR]} />}>
                      <Route path="/app/hr/dashboard" element={<HRDashboard />} />
                      <Route path="/app/hr/employees" element={<HREmployees />} />
                      <Route path="/app/hr/interns" element={<HRInterns />} />
                      <Route path="/app/hr/attendance" element={<HRAttendance />} />
                      <Route path="/app/hr/leaves" element={<HRLeaves />} />
                      <Route path="/app/hr/interviews" element={<HRInterviews />} />
                      <Route path="/app/hr/communications" element={<CommunicationsPage />} />
                      <Route path="/app/hr/payroll" element={<HRPayroll />} />
                      <Route path="/app/hr/performance" element={<HRPerformance />} />
                      <Route path="/app/hr/jobs-board" element={<HRJobsBoard />} />
                    </Route>
                    <Route element={<PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TUTOR]} />}>
                      <Route path="/app/tutor/dashboard" element={<TutorDashboard />} />
                      <Route path="/app/tutor/courses" element={<TutorCourses />} />
                      <Route path="/app/tutor/curriculum" element={<TutorCurriculum />} />
                      <Route path="/app/tutor/students" element={<TutorStudents />} />
                      <Route path="/app/tutor/forum" element={<TutorForum />} />
                      <Route path="/app/tutor/communications" element={<TutorCommunications />} />
                    </Route>
                    <Route element={<PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.PROJECT_MANAGER]} />}>
                      <Route path="/app/pm/dashboard" element={<PMDashboard />} />
                      <Route path="/app/pm/clients" element={<PMClients />} />
                      <Route path="/app/pm/subscriptions" element={<PMSubscriptions />} />
                      <Route path="/app/pm/tasks" element={<PMTasks />} />
                      <Route path="/app/pm/approvals" element={<PMApprovals />} />
                      <Route path="/app/pm/calendar" element={<PMCalendar />} />
                      <Route path="/app/pm/settings" element={<PMCompanySettings />} />
                    </Route>
                    <Route element={<PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.FINANCE]} />}>
                      <Route path="/app/finance/dashboard" element={<FinanceDashboard />} />
                      <Route path="/app/finance/income" element={<FinanceIncome />} />
                      <Route path="/app/finance/expenses" element={<FinanceExpenses />} />
                      <Route path="/app/finance/invoices" element={<FinanceInvoices />} />
                      <Route path="/app/finance/payments" element={<FinancePayments />} />
                      <Route path="/app/finance/schedules" element={<FinanceSchedules />} />
                      <Route path="/app/finance/payroll" element={<FinancePayroll />} />
                    </Route>
                    <Route element={<PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.SALES]} />}>
                      <Route path="/app/sales/dashboard" element={<SalesDashboard />} />
                      <Route path="/app/sales/leads" element={<SalesLeads />} />
                      <Route path="/app/sales/follow-ups" element={<SalesFollowUps />} />
                    </Route>
                    <Route element={<PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.RECEPTION]} />}>
                      <Route path="/app/reception/dashboard" element={<ReceptionDashboard />} />
                      <Route path="/app/reception/attendance" element={<ReceptionAttendance />} />
                      <Route path="/app/reception/calendar" element={<ReceptionCalendar />} />
                      <Route path="/app/reception/communications" element={<ReceptionCommunications />} />
                    </Route>
                    <Route element={<PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EMPLOYEE]} />}>
                      <Route path="/app/employee/dashboard" element={<EmployeeDashboard />} />
                      <Route path="/app/employee/leaves" element={<EmployeeLeaves />} />
                      <Route path="/app/employee/payslips" element={<EmployeePayslips />} />
                      <Route path="/app/employee/performance" element={<EmployeePerformance />} />
                      <Route path="/app/employee/tasks" element={<EmployeeTasks />} />
                      <Route path="/app/employee/calendar" element={<EmployeeCalendar />} />
                      <Route path="/app/employee/approvals" element={<EmployeeApprovals />} />
                    </Route>
                    <Route element={<PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.STUDENT]} />}>
                      <Route path="/app/student/dashboard" element={<StudentDashboard />} />
                      <Route path="/app/student/courses" element={<StudentCourses />} />
                      <Route path="/app/student/course-player" element={<StudentCoursePlayer />} />
                      <Route path="/app/student/live-quiz" element={<StudentLiveQuiz />} />
                      <Route path="/app/student/quiz" element={<StudentQuiz />} />
                      <Route path="/app/student/forum" element={<StudentForum />} />
                      <Route path="/app/student/profile" element={<StudentProfile />} />
                      <Route path="/app/student/projects" element={<StudentProjects />} />
                      <Route path="/app/student/mindmap" element={<StudentMindMap />} />
                      <Route path="/app/student/certificates" element={<StudentCertificates />} />
                    </Route>
                    <Route element={<PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.INTERN]} />}>
                      <Route path="/app/intern/dashboard" element={<InternDashboard />} />
                      <Route path="/app/intern/tasks" element={<InternTasks />} />
                      <Route path="/app/intern/projects" element={<InternProjects />} />
                      <Route path="/app/intern/calendar" element={<InternCalendar />} />
                    </Route>
                  </Route>
                </Route>
              </Routes>
            </Router>
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}

