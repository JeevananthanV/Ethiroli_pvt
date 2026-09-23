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
import TutorDashboard from "./roles/tutor/pages/Dashboard.jsx";
import TutorCourses from "./roles/tutor/pages/Courses.jsx";
import TutorBatches from "./roles/tutor/pages/Batches.jsx";
import TutorCurriculum from "./roles/tutor/pages/CourseCurriculum.jsx";
import TutorStudents from "./roles/tutor/pages/Students.jsx";
import TutorQuestionBank from "./roles/tutor/pages/QuestionBank.jsx";
import PMDashboard from "./roles/project-manager/pages/Dashboard.jsx";
import PMClients from "./roles/project-manager/pages/Clients.jsx";
import PMSubscriptions from "./roles/project-manager/pages/Subscriptions.jsx";
import PMTasks from "./roles/project-manager/pages/Tasks.jsx";
import PMCompanySettings from "./roles/project-manager/pages/CompanySettings.jsx";
import PMProjects from "./roles/project-manager/pages/Projects.jsx";
import PMTeam from "./roles/project-manager/pages/Team.jsx";
import PMTimesheets from "./roles/project-manager/pages/Timesheets.jsx";
import PMClientComms from "./roles/project-manager/pages/ClientCommunication.jsx";
import PMInvoices from "./roles/project-manager/pages/Invoices.jsx";
import PMReports from "./roles/project-manager/pages/Reports.jsx";
import PMMilestones from "./roles/project-manager/pages/Milestones.jsx";
import PMSprints from "./roles/project-manager/pages/Sprints.jsx";
import PMProjectFiles from "./roles/project-manager/pages/ProjectFiles.jsx";
import PMProjectExpenses from "./roles/project-manager/pages/ProjectExpenses.jsx";
import PMPerformance from "./roles/project-manager/pages/Performance.jsx";
import PMNotifications from "./roles/project-manager/pages/Notifications.jsx";
import PMProfile from "./roles/project-manager/pages/Profile.jsx";
import StudentDashboard from "./roles/student/pages/Dashboard.jsx";
import StudentCourses from "./roles/student/pages/Courses.jsx";
import StudentCoursePlayer from "./roles/student/pages/CoursePlayer.jsx";
import StudentLiveQuiz from "./roles/student/pages/LiveQuiz.jsx";
import StudentDoubts from "./roles/student/pages/Doubts.jsx";
import StudentForum from "./roles/student/pages/Forum.jsx";
import StudentProfile from "./roles/student/pages/Profile.jsx";
import StudentProjects from "./roles/student/pages/Projects.jsx";
import StudentMindMap from "./roles/student/pages/MindMap.jsx";
import StudentCertificates from "./roles/student/pages/Certificates.jsx";
import {
  EmployeeDashboard,
  EmployeeTasks,
  EmployeeProjects,
  EmployeeAttendance,
  EmployeeLeaves,
  EmployeeCalendar,
  EmployeeTraining,
  EmployeeAssignments,
  EmployeePerformance,
  EmployeeDocuments,
  EmployeePayslips,
  EmployeeProfile,
  EmployeeApprovals,
  EmployeeAnnouncements,
  EmployeeMessages,
  EmployeeNotifications,
  EmployeeAchievements,
  EmployeeSupport,
} from "./roles/employee/index.js";
import FinanceDashboard from "./roles/finance/pages/Dashboard.jsx";
import FinanceIncome from "./roles/finance/pages/Income.jsx";
import FinanceExpenses from "./roles/finance/pages/Expenses.jsx";
import FinanceInvoices from "./roles/finance/pages/Invoices.jsx";
import FinancePayments from "./roles/finance/pages/Payments.jsx";
import FinanceSchedules from "./roles/finance/pages/Schedules.jsx";
import FinancePayroll from "./roles/finance/pages/Payroll.jsx";
import FinanceClients from "./roles/finance/pages/Clients.jsx";
import FinanceSalary from "./roles/finance/pages/Salary.jsx";
import FinanceTax from "./roles/finance/pages/Tax.jsx";
import FinanceRefunds from "./roles/finance/pages/Refunds.jsx";
import FinanceReceivables from "./roles/finance/pages/Receivables.jsx";
import FinancePayables from "./roles/finance/pages/Payables.jsx";
import FinanceReports from "./roles/finance/pages/Reports.jsx";
import FinanceTransactions from "./roles/finance/pages/Transactions.jsx";
import FinanceCashFlow from "./roles/finance/pages/CashFlow.jsx";
import FinanceBudgets from "./roles/finance/pages/Budgets.jsx";
import FinanceSubscriptions from "./roles/finance/pages/Subscriptions.jsx";
import FinanceDocuments from "./roles/finance/pages/Documents.jsx";
import FinanceApprovals from "./roles/finance/pages/Approvals.jsx";
import FinanceNotifications from "./roles/finance/pages/Notifications.jsx";
import FinanceCalendar from "./roles/finance/pages/Calendar.jsx";
import FinanceSettings from "./roles/finance/pages/Settings.jsx";
import SalesDashboard from "./roles/sales/pages/Dashboard.jsx";
import SalesLeads from "./roles/sales/pages/Leads.jsx";
import SalesContacts from "./roles/sales/pages/Contacts.jsx";
import SalesCompanies from "./roles/sales/pages/Companies.jsx";
import SalesOpportunities from "./roles/sales/pages/Opportunities.jsx";
import SalesDeals from "./roles/sales/pages/Deals.jsx";
import SalesPipeline from "./roles/sales/pages/SalesPipeline.jsx";
import SalesProposals from "./roles/sales/pages/Proposals.jsx";
import SalesFollowUps from "./roles/sales/pages/FollowUps.jsx";
import SalesTasks from "./roles/sales/pages/Tasks.jsx";
import SalesActivities from "./roles/sales/pages/Activities.jsx";
import SalesCalls from "./roles/sales/pages/Calls.jsx";
import SalesMeetings from "./roles/sales/pages/Meetings.jsx";
import SalesCalendar from "./roles/sales/pages/Calendar.jsx";
import SalesSubscriptions from "./roles/sales/pages/Subscriptions.jsx";
import SalesCampaigns from "./roles/sales/pages/Campaigns.jsx";
import SalesHandover from "./roles/sales/pages/Handover.jsx";
import SalesReports from "./roles/sales/pages/Reports.jsx";
import SalesTargets from "./roles/sales/pages/Targets.jsx";
import SalesDocuments from "./roles/sales/pages/Documents.jsx";
import SalesCommunications from "./roles/sales/pages/Communications.jsx";
import SalesNotifications from "./roles/sales/pages/Notifications.jsx";
import SalesProfile from "./roles/sales/pages/Profile.jsx";
import ReceptionDashboard from "./roles/reception/pages/Dashboard.jsx";
import ReceptionEnquiries from "./roles/reception/pages/Enquiries.jsx";
import ReceptionLeads from "./roles/reception/pages/Leads.jsx";
import ReceptionVisitors from "./roles/reception/pages/Visitors.jsx";
import ReceptionFollowUps from "./roles/reception/pages/FollowUps.jsx";
import ReceptionStudents from "./roles/reception/pages/Students.jsx";
import ReceptionInterns from "./roles/reception/pages/Interns.jsx";
import ReceptionEmployees from "./roles/reception/pages/Employees.jsx";
import ReceptionAdmissions from "./roles/reception/pages/Admissions.jsx";
import ReceptionAttendance from "./roles/reception/pages/Attendance.jsx";
import ReceptionRegistration from "./roles/reception/pages/Registration.jsx";
import ReceptionAppointments from "./roles/reception/pages/Appointments.jsx";
import ReceptionCalendar from "./roles/reception/pages/Calendar.jsx";
import ReceptionDocuments from "./roles/reception/pages/Documents.jsx";
import ReceptionPayments from "./roles/reception/pages/Payments.jsx";
import ReceptionReceipts from "./roles/reception/pages/Receipts.jsx";
import ReceptionCommunications from "./roles/reception/pages/Communications.jsx";
import ReceptionAnnouncements from "./roles/reception/pages/Announcements.jsx";
import ReceptionNotifications from "./roles/reception/pages/Notifications.jsx";
import ReceptionReports from "./roles/reception/pages/Reports.jsx";
import ReceptionProfile from "./roles/reception/pages/Profile.jsx";
import {
  SuperAdminDashboard,
  SuperAdminTenants,
  SuperAdminUsers,
  SuperAdminRolesPermissions,
  SuperAdminPlans,
  SuperAdminBilling,
  SuperAdminLeads,
  SuperAdminCalendar,
  SuperAdminApprovals,
  SuperAdminNotifications,
  SuperAdminCommunications,
  SuperAdminAutomationStudio,
  SuperAdminIntegrations,
  SuperAdminMessaging,
  SuperAdminDeveloperPortal,
  SuperAdminMarketplace,
  SuperAdminReports,
  SuperAdminAIAnalytics,
  SuperAdminGamification,
  SuperAdminMonitoring,
  SuperAdminSystemSearch,
  SuperAdminFeatureFlags,
  SuperAdminConfiguration,
  SuperAdminStorage,
  SuperAdminBackups,
  SuperAdminSecurityCenter,
  SuperAdminAuditLogs,
  SuperAdminSettings,
  SuperAdminProfile
} from "./roles/super-admin/index.js";
import {
  AdminDashboard,
  AdminUsers,
  AdminTutors,
  AdminSettings,
  AdminLeads,
  AdminAuditLogs,
  AdminApprovals,
  AdminCalendar,
  AdminCommunications,
  AdminReports,
  AdminAutomationStudio,
  AdminAIAnalytics,
  AdminMarketplace,
  AdminIntegrations,
  AdminDeveloperPortal,
  AdminGamification,
  AdminJobsBoard,
  AdminMonitoring
} from "./roles/admin/index.js";
import StudentQuiz from "./roles/student/pages/Quiz.jsx";
import InternApp from "./roles/intern/InternApp.jsx";
import PMApprovals from "./roles/project-manager/pages/Approvals.jsx";
import PMCalendar from "./roles/project-manager/pages/Calendar.jsx";
import TutorForum from "./roles/tutor/pages/Forum.jsx";
import TutorCommunications from "./roles/tutor/pages/Communications.jsx";
import PublicCourseCatalogPage from "./roles/public/pages/CourseCatalog.jsx";
import PublicCourseDetailPage from "./roles/public/pages/CourseDetail.jsx";
import PublicCheckoutPage from "./roles/public/pages/Checkout.jsx";

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
                <Route path="/auth/student/login" element={<StudentLoginPage />} />
                <Route path="/auth/intern/login" element={<InternLoginPage />} />
                <Route path="/reception.html" element={<Navigate to="/app/reception/dashboard" replace />} />
                <Route path="/reception" element={<Navigate to="/app/reception/dashboard" replace />} />
                <Route path="/sales.html" element={<Navigate to="/app/sales/dashboard" replace />} />
                <Route path="/sales" element={<Navigate to="/app/sales/dashboard" replace />} />
                <Route path="/intern.html" element={<Navigate to="/app/intern/dashboard" replace />} />
                <Route path="/intern" element={<Navigate to="/app/intern/dashboard" replace />} />
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
                    <Route element={<PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN]} />}>
                      {/* Dashboard */}
                      <Route path="/app/super-admin/dashboard" element={<SuperAdminDashboard />} />

                      {/* 1. Platform */}
                      <Route path="/app/super-admin/tenants" element={<SuperAdminTenants />} />
                      <Route path="/app/super-admin/users" element={<SuperAdminUsers />} />
                      <Route path="/app/super-admin/roles-permissions" element={<SuperAdminRolesPermissions />} />
                      <Route path="/app/super-admin/plans" element={<SuperAdminPlans />} />
                      <Route path="/app/super-admin/billing" element={<SuperAdminBilling />} />

                      {/* 2. CRM */}
                      <Route path="/app/super-admin/leads" element={<SuperAdminLeads />} />

                      {/* 3. Operations */}
                      <Route path="/app/super-admin/calendar" element={<SuperAdminCalendar />} />
                      <Route path="/app/super-admin/super-calendar" element={<SuperAdminCalendar />} />
                      <Route path="/app/super-admin/approvals" element={<SuperAdminApprovals />} />
                      <Route path="/app/super-admin/super-approvals" element={<SuperAdminApprovals />} />
                      <Route path="/app/super-admin/notifications" element={<SuperAdminNotifications />} />
                      <Route path="/app/super-admin/communications" element={<SuperAdminCommunications />} />

                      {/* 4. Platform Services */}
                      <Route path="/app/super-admin/automation" element={<SuperAdminAutomationStudio />} />
                      <Route path="/app/super-admin/integrations" element={<SuperAdminIntegrations />} />
                      <Route path="/app/super-admin/super-integrations" element={<SuperAdminIntegrations />} />
                      <Route path="/app/super-admin/messaging" element={<SuperAdminMessaging />} />
                      <Route path="/app/super-admin/developer" element={<SuperAdminDeveloperPortal />} />
                      <Route path="/app/super-admin/marketplace" element={<SuperAdminMarketplace />} />

                      {/* 5. Analytics */}
                      <Route path="/app/super-admin/reports" element={<SuperAdminReports />} />
                      <Route path="/app/super-admin/analytics" element={<SuperAdminAIAnalytics />} />
                      <Route path="/app/super-admin/gamification" element={<SuperAdminGamification />} />
                      <Route path="/app/super-admin/super-gamification" element={<SuperAdminGamification />} />

                      {/* 6. System */}
                      <Route path="/app/super-admin/monitoring" element={<SuperAdminMonitoring />} />
                      <Route path="/app/super-admin/system-search" element={<SuperAdminSystemSearch />} />
                      <Route path="/app/super-admin/feature-flags" element={<SuperAdminFeatureFlags />} />
                      <Route path="/app/super-admin/configuration" element={<SuperAdminConfiguration />} />
                      <Route path="/app/super-admin/storage" element={<SuperAdminStorage />} />
                      <Route path="/app/super-admin/backups" element={<SuperAdminBackups />} />

                      {/* 7. Security */}
                      <Route path="/app/super-admin/security" element={<SuperAdminSecurityCenter />} />
                      <Route path="/app/super-admin/audit-logs" element={<SuperAdminAuditLogs />} />

                      {/* 8. Administration */}
                      <Route path="/app/super-admin/settings" element={<SuperAdminSettings />} />
                      <Route path="/app/super-admin/profile" element={<SuperAdminProfile />} />
                    </Route>
                    <Route element={<PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN]} />}>
                      {/* Domain 1: Executive Dashboard */}
                      <Route path="/app/admin/dashboard" element={<AdminDashboard />} />

                      {/* Domain 2: PEOPLE */}
                      <Route path="/app/admin/users" element={<AdminUsers />} />
                      <Route path="/app/admin/employees" element={<HREmployees />} />
                      <Route path="/app/admin/interns" element={<HRInterns />} />
                      <Route path="/app/admin/students" element={<TutorStudents />} />
                      <Route path="/app/admin/tutors" element={<AdminTutors />} />

                      {/* Domain 3: LEARNING */}
                      <Route path="/app/admin/courses" element={<TutorCourses />} />
                      <Route path="/app/admin/curriculum" element={<TutorCurriculum />} />
                      <Route path="/app/admin/batches" element={<TutorBatches />} />

                      {/* Domain 4: PROJECTS */}
                      <Route path="/app/admin/projects" element={<PMProjects />} />
                      <Route path="/app/admin/teams" element={<PMTeam />} />
                      <Route path="/app/admin/tasks" element={<PMTasks />} />

                      {/* Domain 5: HR MANAGEMENT */}
                      <Route path="/app/admin/attendance" element={<HRAttendance />} />
                      <Route path="/app/admin/leaves" element={<HRLeaves />} />
                      <Route path="/app/admin/performance" element={<HRPerformance />} />
                      <Route path="/app/admin/approvals" element={<AdminApprovals />} />

                      {/* Domain 6: CRM & SALES */}
                      <Route path="/app/admin/leads" element={<AdminLeads />} />
                      <Route path="/app/admin/contacts" element={<SalesContacts />} />
                      <Route path="/app/admin/opportunities" element={<SalesOpportunities />} />
                      <Route path="/app/admin/deals" element={<SalesDeals />} />

                      {/* Domain 7: FINANCE */}
                      <Route path="/app/admin/income" element={<FinanceIncome />} />
                      <Route path="/app/admin/expenses" element={<FinanceExpenses />} />
                      <Route path="/app/admin/invoices" element={<FinanceInvoices />} />
                      <Route path="/app/admin/payments" element={<FinancePayments />} />

                      {/* Domain 8: OPERATIONS */}
                      <Route path="/app/admin/calendar" element={<AdminCalendar />} />
                      <Route path="/app/admin/communications" element={<AdminCommunications />} />
                      <Route path="/app/admin/documents" element={<HRDocuments />} />
                      <Route path="/app/admin/notifications" element={<SalesNotifications />} />

                      {/* Domain 9: RECRUITMENT */}
                      <Route path="/app/admin/jobs-board" element={<AdminJobsBoard />} />

                      {/* Domain 10: REPORTING */}
                      <Route path="/app/admin/reports" element={<AdminReports />} />
                      <Route path="/app/admin/analytics" element={<AdminAIAnalytics />} />

                      {/* Domain 11: AUTOMATION */}
                      <Route path="/app/admin/automation" element={<AdminAutomationStudio />} />
                      <Route path="/app/admin/integrations" element={<AdminIntegrations />} />
                      <Route path="/app/admin/developer" element={<AdminDeveloperPortal />} />

                      {/* Domain 12: ENGAGEMENT */}
                      <Route path="/app/admin/marketplace" element={<AdminMarketplace />} />
                      <Route path="/app/admin/gamification" element={<AdminGamification />} />

                      {/* Domain 13: SECURITY & CONFIG */}
                      <Route path="/app/admin/audit-logs" element={<AdminAuditLogs />} />
                      <Route path="/app/admin/settings" element={<AdminSettings />} />
                      <Route path="/app/admin/monitoring" element={<AdminMonitoring />} />
                    </Route>
                    <Route element={<PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR]} />}>
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
                    <Route element={<PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TUTOR]} />}>
                      <Route path="/app/tutor/dashboard" element={<TutorDashboard />} />
                      <Route path="/app/tutor/courses" element={<TutorCourses />} />
                      <Route path="/app/tutor/batches" element={<TutorBatches />} />
                      <Route path="/app/tutor/curriculum" element={<TutorCurriculum />} />
                      <Route path="/app/tutor/question-bank" element={<TutorQuestionBank />} />
                      <Route path="/app/tutor/students" element={<TutorStudents />} />
                      <Route path="/app/tutor/forum" element={<TutorForum />} />
                      <Route path="/app/tutor/communications" element={<TutorCommunications />} />
                    </Route>
                    <Route element={<PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.PROJECT_MANAGER]} />}>
                      <Route path="/app/pm/dashboard" element={<PMDashboard />} />
                      <Route path="/app/pm/projects" element={<PMProjects />} />
                      <Route path="/app/pm/team" element={<PMTeam />} />
                      <Route path="/app/pm/tasks" element={<PMTasks />} />
                      <Route path="/app/pm/timesheets" element={<PMTimesheets />} />
                      <Route path="/app/pm/client-comms" element={<PMClientComms />} />
                      <Route path="/app/pm/invoices" element={<PMInvoices />} />
                      <Route path="/app/pm/reports" element={<PMReports />} />
                      <Route path="/app/pm/milestones" element={<PMMilestones />} />
                      <Route path="/app/pm/sprints" element={<PMSprints />} />
                      <Route path="/app/pm/files" element={<PMProjectFiles />} />
                      <Route path="/app/pm/expenses" element={<PMProjectExpenses />} />
                      <Route path="/app/pm/performance" element={<PMPerformance />} />
                      <Route path="/app/pm/notifications" element={<PMNotifications />} />
                      <Route path="/app/pm/profile" element={<PMProfile />} />
                      <Route path="/app/pm/approvals" element={<PMApprovals />} />
                      <Route path="/app/pm/calendar" element={<PMCalendar />} />
                      <Route path="/app/pm/settings" element={<PMCompanySettings />} />
                      <Route path="/app/pm/clients" element={<PMClients />} />
                      <Route path="/app/pm/subscriptions" element={<PMSubscriptions />} />
                    </Route>
                    <Route element={<PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.FINANCE]} />}>
                      <Route path="/app/finance/dashboard" element={<FinanceDashboard />} />
                      <Route path="/app/finance/transactions" element={<FinanceTransactions />} />
                      <Route path="/app/finance/cashflow" element={<FinanceCashFlow />} />
                      <Route path="/app/finance/income" element={<FinanceIncome />} />
                      <Route path="/app/finance/expenses" element={<FinanceExpenses />} />
                      <Route path="/app/finance/invoices" element={<FinanceInvoices />} />
                      <Route path="/app/finance/payments" element={<FinancePayments />} />
                      <Route path="/app/finance/receivables" element={<FinanceReceivables />} />
                      <Route path="/app/finance/payables" element={<FinancePayables />} />
                      <Route path="/app/finance/refunds" element={<FinanceRefunds />} />
                      <Route path="/app/finance/clients" element={<FinanceClients />} />
                      <Route path="/app/finance/subscriptions" element={<FinanceSubscriptions />} />
                      <Route path="/app/finance/payroll" element={<FinancePayroll />} />
                      <Route path="/app/finance/salary" element={<FinanceSalary />} />
                      <Route path="/app/finance/schedules" element={<FinanceSchedules />} />
                      <Route path="/app/finance/budgets" element={<FinanceBudgets />} />
                      <Route path="/app/finance/tax" element={<FinanceTax />} />
                      <Route path="/app/finance/reports" element={<FinanceReports />} />
                      <Route path="/app/finance/documents" element={<FinanceDocuments />} />
                      <Route path="/app/finance/approvals" element={<FinanceApprovals />} />
                      <Route path="/app/finance/calendar" element={<FinanceCalendar />} />
                      <Route path="/app/finance/notifications" element={<FinanceNotifications />} />
                      <Route path="/app/finance/settings" element={<FinanceSettings />} />
                    </Route>
                    <Route element={<PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.SALES]} />}>
                      {/* 1. Dashboard & Core */}
                      <Route path="/app/sales/dashboard" element={<SalesDashboard />} />

                      {/* 2. CRM & Lead Management */}
                      <Route path="/app/sales/leads" element={<SalesLeads />} />
                      <Route path="/app/sales/contacts" element={<SalesContacts />} />
                      <Route path="/app/sales/companies" element={<SalesCompanies />} />
                      <Route path="/app/sales/opportunities" element={<SalesOpportunities />} />

                      {/* 3. Sales Pipeline & Deal Tracking */}
                      <Route path="/app/sales/deals" element={<SalesDeals />} />
                      <Route path="/app/sales/pipeline" element={<SalesPipeline />} />
                      <Route path="/app/sales/proposals" element={<SalesProposals />} />

                      {/* 4. Activity & Task Management */}
                      <Route path="/app/sales/follow-ups" element={<SalesFollowUps />} />
                      <Route path="/app/sales/tasks" element={<SalesTasks />} />
                      <Route path="/app/sales/activities" element={<SalesActivities />} />
                      <Route path="/app/sales/calls" element={<SalesCalls />} />
                      <Route path="/app/sales/meetings" element={<SalesMeetings />} />
                      <Route path="/app/sales/calendar" element={<SalesCalendar />} />

                      {/* 5. Revenue & Growth */}
                      <Route path="/app/sales/subscriptions" element={<SalesSubscriptions />} />
                      <Route path="/app/sales/campaigns" element={<SalesCampaigns />} />
                      <Route path="/app/sales/handover" element={<SalesHandover />} />

                      {/* 6. Analytics & Reporting */}
                      <Route path="/app/sales/reports" element={<SalesReports />} />
                      <Route path="/app/sales/targets" element={<SalesTargets />} />

                      {/* 7. Operations, Comms & Profile */}
                      <Route path="/app/sales/documents" element={<SalesDocuments />} />
                      <Route path="/app/sales/communications" element={<SalesCommunications />} />
                      <Route path="/app/sales/notifications" element={<SalesNotifications />} />
                      <Route path="/app/sales/profile" element={<SalesProfile />} />
                    </Route>
                    <Route element={<PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.RECEPTION]} />}>
                      {/* Core Dashboard */}
                      <Route path="/app/reception/dashboard" element={<ReceptionDashboard />} />

                      {/* Module 1: Sales & CRM */}
                      <Route path="/app/reception/enquiries" element={<ReceptionEnquiries />} />
                      <Route path="/app/reception/leads" element={<ReceptionLeads />} />
                      <Route path="/app/reception/visitors" element={<ReceptionVisitors />} />
                      <Route path="/app/reception/follow-ups" element={<ReceptionFollowUps />} />

                      {/* Module 2: Academic & Talent Management */}
                      <Route path="/app/reception/students" element={<ReceptionStudents />} />
                      <Route path="/app/reception/interns" element={<ReceptionInterns />} />
                      <Route path="/app/reception/employees" element={<ReceptionEmployees />} />
                      <Route path="/app/reception/admissions" element={<ReceptionAdmissions />} />
                      <Route path="/app/reception/attendance" element={<ReceptionAttendance />} />
                      <Route path="/app/reception/registration" element={<ReceptionRegistration />} />

                      {/* Module 3: Operations & Scheduling */}
                      <Route path="/app/reception/appointments" element={<ReceptionAppointments />} />
                      <Route path="/app/reception/calendar" element={<ReceptionCalendar />} />
                      <Route path="/app/reception/documents" element={<ReceptionDocuments />} />

                      {/* Module 4: Financial Management */}
                      <Route path="/app/reception/payments" element={<ReceptionPayments />} />
                      <Route path="/app/reception/receipts" element={<ReceptionReceipts />} />

                      {/* Module 5: Communication & Engagement */}
                      <Route path="/app/reception/communications" element={<ReceptionCommunications />} />
                      <Route path="/app/reception/announcements" element={<ReceptionAnnouncements />} />
                      <Route path="/app/reception/notifications" element={<ReceptionNotifications />} />

                      {/* Module 6: Analytics & User Management */}
                      <Route path="/app/reception/reports" element={<ReceptionReports />} />
                      <Route path="/app/reception/profile" element={<ReceptionProfile />} />
                    </Route>
                    <Route element={<PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EMPLOYEE]} />}>
                      {/* 1. Dashboard */}
                      <Route path="/app/employee/dashboard" element={<EmployeeDashboard />} />

                      {/* 2. Employee Management */}
                      <Route path="/app/employee/tasks" element={<EmployeeTasks />} />
                      <Route path="/app/employee/projects" element={<EmployeeProjects />} />
                      <Route path="/app/employee/attendance" element={<EmployeeAttendance />} />
                      <Route path="/app/employee/leaves" element={<EmployeeLeaves />} />
                      <Route path="/app/employee/calendar" element={<EmployeeCalendar />} />

                      {/* 3. Learning & Development */}
                      <Route path="/app/employee/training" element={<EmployeeTraining />} />
                      <Route path="/app/employee/assignments" element={<EmployeeAssignments />} />
                      <Route path="/app/employee/performance" element={<EmployeePerformance />} />

                      {/* 4. Personal Records */}
                      <Route path="/app/employee/documents" element={<EmployeeDocuments />} />
                      <Route path="/app/employee/payslips" element={<EmployeePayslips />} />
                      <Route path="/app/employee/profile" element={<EmployeeProfile />} />

                      {/* 5. Communication & Governance */}
                      <Route path="/app/employee/approvals" element={<EmployeeApprovals />} />
                      <Route path="/app/employee/announcements" element={<EmployeeAnnouncements />} />
                      <Route path="/app/employee/messages" element={<EmployeeMessages />} />
                      <Route path="/app/employee/notifications" element={<EmployeeNotifications />} />
                      <Route path="/app/employee/achievements" element={<EmployeeAchievements />} />
                      <Route path="/app/employee/support" element={<EmployeeSupport />} />
                    </Route>
                    <Route element={<PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.STUDENT]} />}>
                      <Route path="/app/student/dashboard" element={<StudentDashboard />} />
                      <Route path="/app/student/courses" element={<StudentCourses />} />
                      <Route path="/app/student/course-player" element={<StudentCoursePlayer />} />
                      <Route path="/app/student/live-quiz" element={<StudentLiveQuiz />} />
                      <Route path="/app/student/quiz" element={<StudentQuiz />} />
                      <Route path="/app/student/doubts" element={<StudentDoubts />} />
                      <Route path="/app/student/forum" element={<StudentForum />} />
                      <Route path="/app/student/profile" element={<StudentProfile />} />
                      <Route path="/app/student/projects" element={<StudentProjects />} />
                      <Route path="/app/student/mindmap" element={<StudentMindMap />} />
                      <Route path="/app/student/certificates" element={<StudentCertificates />} />
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
