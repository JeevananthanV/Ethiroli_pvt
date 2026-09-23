# Ethiroli SaaS Platform — Project Blueprint

## What It Does

Ethiroli is an **enterprise-grade SaaS platform** for training institutes and businesses that unifies **9 core operational modules** into a single role-based web application:

| Module | Purpose |
|--------|---------|
| **CRM** | Lead management, sales pipeline, follow-ups |
| **LMS** | Course creation, student enrollment, quizzes, assignments, certificates |
| **HRMS** | Employee/intern management, attendance, leaves, payroll, performance reviews |
| **PMS** | Project management, client billing, subscriptions, tasks |
| **Finance** | Income/expenses tracking, invoicing, payments, recurring schedules |
| **Recruitment** | Job postings, candidate pipeline, interviews |
| **Calendar** | Event management, scheduling, holidays |
| **Monitoring** | System health, error tracking, audit logs |
| **Marketplace** | Multi-tenant SaaS marketplace, subscriptions, coupons |

---

## Architecture

### Monorepo Structure
```
J:\eithiroli\ethiroli_react\
├── backend/              # Express.js REST API + Socket.IO (Node.js, MySQL)
├── frontend/             # React 19 admin portal + public marketing site
├── docs/
├── scripts/
├── package.json
└── README.md
```

### Backend
- **Server**: Express.js on port 5000, Socket.IO on port 3003
- **Database**: MySQL with 65+ tables
- **API**: REST endpoints under `/api/v1/`
- **Organization**: 8 development phases, controllers/routes/models per domain entity
- **Features**: RBAC, CSRF protection, rate limiting, AES-256-GCM encryption, real-time events via Socket.IO

### Frontend
- **Public Site** (`App.jsx`): Home, About, Career, Contact pages
- **Admin Portal** (`AdminApp.jsx`): 11 role-scoped dashboards (SUPER_ADMIN, ADMIN, HR, TUTOR, PROJECT_MANAGER, FINANCE, SALES, RECEPTION, EMPLOYEE, STUDENT, INTERN)
- **State**: Redux Toolkit with 30+ slices
- **API Layer**: 50+ Axios clients in `services/api/`
- **UI**: Feature modules under `modules/` (monitoring, lms, hrms, crm, finance, projects, etc.)

---

## Full Folder Structure

```
J:\eithiroli\ethiroli_react\
├── package.json                                  # Root workspace descriptor
├── README.md                                     # Project overview and feature matrix
├── docs/                                         # Documentation
├── scripts/                                      # Utility scripts
│
├── backend/
│   ├── .env                                      # Environment variables (sensitive)
│   ├── .env.example                              # Environment variable template
│   ├── package.json                              # Backend dependencies (Express, mysql2, socket.io, bcrypt)
│   ├── schema.sql                                # 65-table MySQL DDL
│   └── src/
│       ├── server.js                             # HTTP + Socket.IO bootstrap
│       ├── app.js                                # Express middleware stack (CORS, CSRF, rate limiter)
│       ├── routes.js                             # Route registration
│       ├── config/
│       │   ├── database.js                       # DB connection config
│       │   ├── constants.js                      # Shared backend constants
│       │   ├── encryption.js                     # AES-256-GCM + PBKDF2 key derivation
│       │   ├── logger.js                         # Structured logging utility
│       │   ├── migrate.js                        # Database migration runner
│       │   └── navigationConfig.js               # Navigation configuration
│       ├── middleware/
│       │   ├── auth.js                           # Session/cookie authentication
│       │   ├── rbac.js                           # Role-based access control (requireRole, requireLeadOwnerOrAdmin)
│       │   ├── csrf.js                           # Origin/Referer CSRF validation
│       │   ├── rateLimiter.js                    # Global + login-specific rate limiting
│       │   ├── validation.js                     # Request payload validators
│       │   ├── tenantResolver.js                 # Multi-tenant subdomain/header/query resolution
│       │   ├── errorHandler.js                   # Centralized error formatting
│       │   ├── apiKeyAuth.js                     # API key authentication for external integrations
│       │   ├── apiVersioning.js                  # API version negotiation
│       │   ├── portalAuth.js                     # Portal-specific authentication
│       │   ├── requestId.js                      # Request ID correlation
│       │   ├── rolePathGuard.js                  # Role-based path guards
│       │   └── security.js                       # Security headers and hardening
│       ├── controllers/                          # 70 request handlers (one per domain entity)
│       │   ├── authController.js
│       │   ├── userController.js
│       │   ├── leadController.js
│       │   ├── employeeController.js
│       │   ├── internController.js
│       │   ├── attendanceController.js
│       │   ├── leaveController.js
│       │   ├── courseController.js
│       │   ├── moduleController.js
│       │   ├── lessonController.js
│       │   ├── enrollmentController.js
│       │   ├── quizController.js
│       │   ├── assignmentController.js
│       │   ├── clientController.js
│       │   ├── subscriptionController.js
│       │   ├── taskController.js
│       │   ├── transactionController.js
│       │   ├── invoiceController.js
│       │   ├── paymentController.js
│       │   ├── recurringScheduleController.js
│       │   ├── liveQuizController.js
│       │   ├── forumController.js
│       │   ├── badgeController.js
│       │   ├── communicationController.js
│       │   ├── templateController.js
│       │   ├── providerController.js
│       │   ├── jobController.js
│       │   ├── candidateController.js
│       │   ├── interviewController.js
│       │   ├── integrationController.js
│       │   ├── payrollController.js
│       │   ├── performanceController.js
│       │   ├── calendarController.js
│       │   ├── holidayController.js
│       │   ├── workflowController.js
│       │   ├── approvalController.js
│       │   ├── companySettingController.js
│       │   ├── jobBoardController.js
│       │   ├── projectController.js
│       │   ├── mindMapController.js
│       │   ├── certificateController.js
│       │   ├── monitoringController.js
│       │   ├── tenantController.js
│       │   ├── marketplaceController.js
│       │   ├── cartController.js
│       │   ├── couponController.js
│       │   ├── orderController.js
│       │   ├── reportController.js
│       │   ├── scheduledReportController.js
│       │   ├── apiKeyController.js
│       │   ├── webhookSubscriptionController.js
│       │   ├── predictiveController.js
│       │   ├── automationController.js
│       │   ├── pushNotificationController.js
│       │   ├── systemController.js
│       │   ├── healthController.js
│       │   ├── auditController.js
│       │   ├── feedController.js
│       │   ├── contactController.js
│       │   ├── exitController.js
│       │   ├── employeeDocumentController.js
│       │   ├── employeePortalController.js
│       │   ├── hrDashboardController.js
│       │   ├── lmsController.js
│       │   ├── n8nController.js
│       │   ├── operationsController.js
│       │   ├── pmController.js
│       │   ├── receptionController.js
│       │   ├── salesController.js
│       │   └── ...
│       ├── graphql/
│       │   ├── context.js
│       │   ├── schema.graphql
│       │   └── resolvers/
│       ├── integrations/
│       │   └── n8n-templates/
│       ├── middleware/
│       │   └── (see above)
│       ├── migrations/
│       │   ├── employee_portal_schema.sql
│       │   ├── finance_dashboard_schema_extension.sql
│       │   ├── hrms_schema_enhancements.sql
│       │   ├── integrations_schema_extension.sql
│       │   ├── lms_schema_extension.sql
│       │   ├── operations_schema_extension.sql
│       │   ├── pm_dashboard_schema_extension.sql
│       │   ├── reception_dashboard_schema_extension.sql
│       │   └── sales_dashboard_schema_extension.sql
│       ├── models/                                 # 90+ Sequelize-style ORM models
│       │   ├── User.js, Session.js, Lead.js, ActivityFeed.js, AuditLog.js
│       │   ├── SystemConfig.js, Employee.js, Intern.js, Attendance.js
│       │   ├── Leave.js, Course.js, Module.js, Lesson.js, Enrollment.js
│       │   ├── Quiz.js, Assignment.js, Client.js, Subscription.js, Task.js
│       │   ├── Invoice.js, Transaction.js, Payment.js, RecurringSchedule.js
│       │   ├── QuizAttempt.js, AssignmentSubmission.js, ForumPost.js
│       │   ├── ForumReply.js, Badge.js, UserBadge.js, LiveQuizSession.js
│       │   ├── ProviderConfig.js, CommunicationTemplate.js, CommunicationLog.js
│       │   ├── Job.js, Candidate.js, Interview.js, Integration.js
│       │   ├── SalaryStructure.js, Payroll.js, PerformanceReview.js
│       │   ├── CalendarEvent.js, Holiday.js, Workflow.js, ApprovalChain.js
│       │   ├── ApprovalInstance.js, CompanySetting.js, JobBoardPost.js
│       │   ├── StudentProject.js, MindMapNode.js, Certificate.js
│       │   ├── SystemErrorLog.js, Tenant.js, TenantUser.js
│       │   ├── Product.js, Coupon.js, CartSession.js, Order.js, OrderItem.js
│       │   ├── ReportDefinition.js, ScheduledReport.js, ApiKey.js
│       │   ├── WebhookSubscription.js, DeviceRegistration.js
│       │   ├── PredictionLog.js, AutomationWorkflow.js, WorkflowNode.js
│       │   ├── WorkflowExecution.js, AnomalyLog.js
│       │   ├── Batch.js, CustomerHandover.js, Doubt.js, FinancialBudget.js
│       │   ├── FinancialRefund.js, Message.js, MfaSecret.js, OAuthState.js
│       │   ├── ProjectExpense.js, ProjectFile.js, ProjectMember.js
│       │   ├── ProjectMilestone.js, ProjectSprint.js, SupportTicket.js
│       │   ├── TaxFiling.js, Timesheet.js, VisitorLog.js
│       │   ├── SalesActivity.js, SalesDeal.js, SalesProposal.js, SalesTarget.js
│       │   └── ...
│       ├── routes/                                 # 70+ route files mounted under /api/v1
│       │   ├── index.js                            # Central router mount point
│       │   ├── authRoutes.js, userRoutes.js, leadRoutes.js, feedRoutes.js
│       │   ├── auditRoutes.js, systemRoutes.js, healthRoutes.js, employeeRoutes.js
│       │   ├── internRoutes.js, attendanceRoutes.js, leaveRoutes.js
│       │   ├── courseRoutes.js, moduleRoutes.js, lessonRoutes.js
│       │   ├── enrollmentRoutes.js, quizRoutes.js, assignmentRoutes.js
│       │   ├── clientRoutes.js, subscriptionRoutes.js, taskRoutes.js
│       │   ├── transactionRoutes.js, invoiceRoutes.js, paymentRoutes.js
│       │   ├── recurringScheduleRoutes.js
│       │   ├── liveQuizRoutes.js, forumRoutes.js, badgeRoutes.js
│       │   ├── communicationRoutes.js, templateRoutes.js, providerRoutes.js
│       │   ├── jobRoutes.js, candidateRoutes.js, interviewRoutes.js
│       │   ├── integrationRoutes.js, payrollRoutes.js, performanceRoutes.js
│       │   ├── calendarRoutes.js, holidayRoutes.js, workflowRoutes.js
│       │   ├── approvalRoutes.js, companySettingRoutes.js
│       │   ├── jobBoardRoutes.js, projectRoutes.js, mindMapRoutes.js
│       │   ├── certificateRoutes.js, monitoringRoutes.js
│       │   ├── tenantRoutes.js, marketplaceRoutes.js, cartRoutes.js
│       │   ├── orderRoutes.js, couponRoutes.js, reportRoutes.js, scheduledReportRoutes.js
│       │   ├── apiKeyRoutes.js, webhookRoutes.js
│       │   ├── predictiveRoutes.js, automationRoutes.js, notificationRoutes.js
│       │   ├── contactRoutes.js, exitRoutes.js
│       │   ├── employeeDocumentRoutes.js, employeePortalRoutes.js
│       │   ├── hrDashboardRoutes.js, lmsRoutes.js, operationsRoutes.js
│       │   ├── pmRoutes.js, receptionRoutes.js, salesRoutes.js, roleRoutes.js
│       │   ├── vendor/, client/, admin/             # Route subdirectories
│       │   └── ...
│       ├── services/                               # Business logic & external integrations
│       │   ├── socketService.js, emailService.js, smsService.js
│       │   ├── whatsappService.js, encryptionService.js
│       │   ├── integrationService.js, calendarSyncService.js
│       │   ├── certificateGenerator.js, pdfGenerator.js, payrollCalculator.js
│       │   ├── paymentService.js, searchService.js, reportGenerator.js
│       │   ├── webhookProcessor.js, webhookDispatcher.js
│       │   ├── pushNotificationService.js, mlService.js
│       │   ├── linkedinService.js, jobBoardService.js, internshalaService.js
│       │   ├── indeedService.js, githubService.js, elasticsearchService.js
│       │   ├── dataWarehouseSync.js, anomalyDetectionService.js
│       │   ├── workflowEngine.js, whiteLabelService.js
│       │   ├── brevoService.js, fcmService.js, n8nService.js
│       │   ├── naukriService.js, oauthService.js, mfaService.js
│       │   └── ...
│       └── socket/
│           ├── index.js                            # Socket.IO server bootstrap
│           └── handlers.js                         # Event handlers (lead_created, new_activity, etc.)
│       ├── graphql/                                # GraphQL API layer
│       │   ├── context.js
│       │   ├── schema.graphql
│       │   └── resolvers/
│       ├── integrations/                           # External integration adapters
│       │   └── n8n-templates/
│       ├── migrations/                             # SQL schema migration files
│       │   └── (9 schema migration files)
│       ├── models/                                 # ORM models
│       │   └── (90+ model files)
│       ├── routes/                                 # Route handlers
│       │   └── (70+ route files + subdirectories)
│       ├── services/                               # Service layer
│       │   └── (33 service files)
│       ├── socket/                                 # Socket.IO setup
│       │   └── (2 files)
│       └── utils/                                  # Backend utility functions
│           ├── constants.js, dateUtils.js, errors.js, response.js, validators.js
│
├── frontend/
│   ├── package.json                              # React 19, Redux Toolkit, React Router DOM v6, Axios, Framer Motion
│   ├── vite.config.js                            # Vite multi-page config (index.html + admin.html)
│   ├── admin.html                                # Admin portal entry point
│   ├── .env.example
│   └── src/
│       ├── main.jsx                              # Public site bootstrap (ReactDOM.createRoot)
│       ├── admin.jsx                              # Admin module entry
│       ├── AdminApp.jsx                          # Admin portal bootstrap
│       ├── AdminApp.complex.jsx                  # Complex admin variant
│       ├── App.jsx                               # Public marketing site router
│       ├── App.css
│       ├── hr.jsx                                 # HR app entry
│       ├── HRApp.jsx                              # HR portal app
│       ├── intern.jsx                             # Intern app entry
│       ├── InternApp.jsx                          # Intern portal app
│       ├── routes.js                              # Route definitions
│       ├── index.css
│       ├── admin/                                # Admin module
│       │   ├── main.jsx
│       │   ├── modules/
│       │   ├── roles/
│       │   └── store/
│       ├── app/                                  # Application core
│       │   └── marketing/
│       ├── assets/                               # Static assets
│       │   └── react.svg
│       ├── auth/                                 # Authentication module
│       │   ├── index.js
│       │   ├── components/
│       │   ├── pages/
│       │   └── portals/
│       ├── common/                               # Shared/common code
│       │   ├── AppShell.jsx
│       │   ├── components/
│       │   ├── contexts/
│       │   ├── hooks/
│       │   ├── layout/
│       │   └── utils/
│       ├── components/                           # Shared UI components
│       │   ├── about/ (CTAabout, CTAJoin, Hero, Introduction, Leadership, Projects, Team, VisionMission)
│       │   ├── career/ (CareerApply, CareerContent, CareerHero)
│       │   ├── home/ (AboutPreview, Activities, ContactForm, CTA, Hero, Marquee, ProjectsPreview, ServicesSlider, Testimonials)
│       │   ├── projects/ (Ethiroliseminar..., GlamersGathering, JciDigitalSkills, jci/*)
│       │   └── shared/ (comming_soon, Footer, Navbar, PremiumMotionProvider, ScrollToTopBtn, WhatsAppBtn)
│       ├── hooks/                                # Custom React hooks
│       │   └── usePushNotification.js
│       ├── modules/                              # Feature modules (each with components/ and index.js)
│       │   ├── approvals/
│       │   ├── audit/
│       │   ├── automation/
│       │   ├── calendar/
│       │   ├── certificates/
│       │   ├── communication/
│       │   ├── crm/
│       │   ├── developer-portal/
│       │   ├── feed/
│       │   ├── finance/
│       │   ├── gamification/
│       │   ├── hrms/
│       │   ├── integrations/
│       │   ├── interviews/
│       │   ├── jobs/
│       │   ├── jobsBoard/
│       │   ├── lms/
│       │   ├── marketplace/
│       │   ├── mindmap/
│       │   ├── monitoring/
│       │   ├── multi-tenant/
│       │   ├── pms/
│       │   ├── predictive/
│       │   ├── projects/
│       │   ├── reporting/
│       │   ├── settings/
│       │   └── users/
│       ├── pages/                                # Page-level components
│       │   ├── About.jsx, Career.jsx, Contact.jsx, Home.jsx
│       │   ├── PrivacyPolicy.jsx, TermsOfService.jsx
│       │   ├── project_home.jsx, services.jsx
│       ├── roles/                                # 11 role-scoped admin dashboards
│       │   ├── admin/
│       │   ├── employee/
│       │   ├── finance/
│       │   ├── hr/
│       │   ├── intern/
│       │   ├── project-manager/
│       │   ├── public/
│       │   ├── reception/
│       │   ├── sales/
│       │   ├── student/
│       │   ├── super-admin/
│       │   └── tutor/
│       ├── services/                             # API service layer
│       │   ├── adminApi.js, authService.js, leadService.js, userService.js
│       │   ├── axios.js
│       │   ├── fcmClient.js
│       │   └── api/                              # 50+ Axios API clients
│       │       ├── axiosInstance.js
│       │       ├── authApi.js, userApi.js, leadApi.js, employeeApi.js
│       │       ├── attendanceApi.js, leaveApi.js, courseApi.js, moduleApi.js
│       │       ├── lessonApi.js, enrollmentApi.js, quizApi.js, assignmentApi.js
│       │       ├── clientApi.js, subscriptionApi.js, taskApi.js
│       │       ├── transactionApi.js, invoiceApi.js, paymentApi.js
│       │       ├── liveQuizApi.js, forumApi.js, badgeApi.js
│       │       ├── communicationApi.js, templateApi.js, providerApi.js
│       │       ├── jobApi.js, candidateApi.js, interviewApi.js
│       │       ├── integrationApi.js, payrollApi.js, performanceApi.js
│       │       ├── calendarApi.js, holidayApi.js, workflowApi.js
│       │       ├── approvalApi.js, companySettingApi.js
│       │       ├── jobBoardApi.js, projectApi.js, mindMapApi.js
│       │       ├── certificateApi.js, monitoringApi.js
│       │       ├── tenantApi.js, marketplaceApi.js, cartApi.js
│       │       ├── couponApi.js, reportApi.js, scheduledReportApi.js
│       │       ├── apiKeyApi.js, webhookApi.js
│       │       ├── predictiveApi.js, automationApi.js
│       │       ├── notificationApi.js, feedApi.js, auditApi.js
│       │       ├── systemApi.js, searchApi.js, candidateApi.js
│       │       └── ...
│       ├── store/                                # Redux store
│       │   ├── index.js                          # Redux store configuration
│       │   ├── hooks.js                          # Typed useDispatch / useSelector
│       │   └── slices/                           # 30+ Redux Toolkit slices
│       │       ├── authSlice.js, usersSlice.js, leadsSlice.js
│       │       ├── employeesSlice.js, attendanceSlice.js, leavesSlice.js
│       │       ├── coursesSlice.js, enrollmentsSlice.js, quizzesSlice.js
│       │       ├── clientsSlice.js, tasksSlice.js, invoicesSlice.js
│       │       ├── transactionsSlice.js, paymentsSlice.js, payrollSlice.js
│       │       ├── communicationsSlice.js, templatesSlice.js, jobsSlice.js
│       │       ├── interviewsSlice.js, candidatesSlice.js
│       │       ├── integrationsSlice.js, calendarSlice.js, holidaySlice.js
│       │       ├── approvalsSlice.js, companySettingsSlice.js
│       │       ├── projectsSlice.js, mindmapSlice.js, certificatesSlice.js
│       │       ├── monitoringSlice.js, tenantsSlice.js, productsSlice.js
│       │       ├── cartSlice.js, ordersSlice.js, couponsSlice.js
│       │       ├── reportsSlice.js, apiKeysSlice.js, webhooksSlice.js
│       │       ├── predictiveSlice.js, automationSlice.js
│       │       ├── pushNotificationsSlice.js, feedSlice.js, auditSlice.js
│       │       ├── uiSlice.js, badgesSlice.js, performanceSlice.js
│       │       └── ...
│       ├── styles/                               # Global and component styles
│       │   ├── global.css, admin.css, premium-motion.css
│       │   ├── EthiroliStyles.css, home-hero.css
│       │   ├── career-apply.css, contact-page.css, jcidigitalskills.css
│       └── utils/
│           └── errorHandler.js, registerServiceWorker.js
│
└── docs/                                         # This documentation directory
```

---

## Key Technical Features

- **Multi-Tenant SaaS**: White-label branding, tenant isolation
- **Real-Time Collaboration**: Socket.IO for live updates, notifications, presence
- **Role-Based Access Control**: 11 roles with granular permissions
- **Secure**: bcrypt sessions, CSRF protection, rate limiting, encrypted sensitive fields
- **Developer Portal**: API keys, webhooks, integration testing playground

---

## Development Phases

| Phase | Modules |
|-------|---------|
| 1 | Auth, Users, Leads, Activity Feed, Audit Logs, System Config |
| 2 | Employees, Interns, Attendance, Leaves, Courses, Modules, Lessons, Enrollments, Quizzes, Assignments, Clients, Subscriptions, Tasks |
| 3 | Transactions, Invoices, Payments, Live Quiz, Forum, Badges |
| 4 | Communications, Templates, Providers, Jobs, Candidates, Interviews, Integrations |
| 5 | Payroll, Performance, Calendar, Holidays, Workflows, Approvals, Company Settings |
| 6 | Job Board, Projects, Mind Maps, Certificates, Monitoring |
| 7 | Tenants, Marketplace, Cart, Coupons, Reports, Scheduled Reports, API Keys, Webhooks |
| 8 | Predictive AI, Automation, Push Notifications |

---

## Role-Based Access Control (RBAC)

The system defines **11 distinct roles**:

| Role | Frontend Key | Backend Enum |
|------|-------------|--------------|
| Super Administrator | `SUPER_ADMIN` | `SUPER_ADMIN` |
| Administrator | `ADMIN` | `ADMIN` |
| Human Resources | `HR` | `HR` |
| Tutor / Instructor | `TUTOR` | `TUTOR` |
| Project Manager | `PROJECT_MANAGER` | `PROJECT_MANAGER` |
| Finance Officer | `FINANCE` | `FINANCE` |
| Sales Executive | `SALES` | `SALES` |
| Receptionist | `RECEPTION` | `RECEPTION` |
| Employee | `EMPLOYEE` | `EMPLOYEE` |
| Student / Learner | `STUDENT` | `STUDENT` |
| Intern | `INTERN` | `INTERN` |

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Backend Runtime** | Node.js (ES Modules) |
| **Backend Framework** | Express.js |
| **Database** | MySQL (mysql2/promise) |
| **Real-Time** | Socket.IO |
| **Frontend Framework** | React 19 |
| **Frontend Build** | Vite |
| **State Management** | Redux Toolkit |
| **Routing** | React Router DOM v6 |
| **API Client** | Axios |
| **Animations** | Framer Motion |
| **Testing** | Vitest |

---

## Setup Instructions

### Backend Setup
```bash
cd J:\eithiroli\ethiroli_react\backend
npm install
cp .env.example .env
npm run migrate
npm run dev
```

### Frontend Setup
```bash
cd J:\eithiroli\ethiroli_react\frontend
npm install
npm run dev
```
