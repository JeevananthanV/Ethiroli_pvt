# Ethiroli SaaS Platform — Comprehensive Project Documentation

## 1. Project Overview

**Ethiroli** is an enterprise-grade, all-in-one SaaS platform designed for training institutes and businesses. It unifies nine core operational modules into a single, role-based web application with real-time collaboration, encrypted data storage, and multi-tenant support.

The repository is structured as a **monorepo** containing three primary packages:
- **`ethiroli-react/backend`**: An Express.js REST API + Socket.IO server (Node.js, ES Modules, MySQL).
- **`ethiroli-react/frontend`**: A React 19 admin portal and public marketing site, powered by Vite, Redux Toolkit, React Router DOM, Axios, Socket.IO Client, and Framer Motion.
- **`ethiroli-vue`**: A Vue 3 public marketing site with Vue Router 4 and Vite.

The backend is organized into **8 development phases**, each adding a discrete set of modules, controllers, routes, models, and services. The React frontend mirrors this modularity through feature-based `modules/`, domain-specific `store/slices/`, dedicated `services/api/` clients, and **11 role-scoped dashboards** under `src/roles/`.

---

## 2. Directory & File Structure

```
J:\eithiroli\ethiroli_react\
├── package.json                          # Root workspace descriptor
├── README.md                             # Project overview and feature matrix
│
├── ethiroli-react/
│   ├── backend/
│   │   ├── package.json                  # Backend dependencies (Express, mysql2, socket.io, bcrypt)
│   │   ├── schema.sql                    # 65-table MySQL DDL
│   │   ├── .env.example                  # Environment variable template
│   │   └── src/
│   │       ├── server.js                 # HTTP + Socket.IO bootstrap
│   │       ├── app.js                    # Express middleware stack (CORS, CSRF, rate limiter)
│   │       ├── db.js                     # MySQL connection pool (mysql2/promise)
│   │       ├── config/
│   │       │   ├── database.js           # Alternate DB pool (used by server.js)
│   │       │   ├── encryption.js         # AES-256-GCM + PBKDF2 key derivation
│   │       │   ├── migrate.js            # Database migration runner
│   │       │   ├── logger.js             # Structured logging utility
│   │       │   └── constants.js          # Shared backend constants
│   │       ├── middleware/
│   │       │   ├── auth.js               # Session/cookie authentication
│   │       │   ├── rbac.js               # Role-based access control (requireRole, requireLeadOwnerOrAdmin)
│   │       │   ├── csrf.js               # Origin/Referer CSRF validation
│   │       │   ├── rateLimiter.js        # Global + login-specific rate limiting
│   │       │   ├── validation.js         # Request payload validators
│   │       │   ├── tenantResolver.js     # Multi-tenant subdomain/header/query resolution
│   │       │   ├── errorHandler.js       # Centralized error formatting
│   │       │   └── apiKeyAuth.js         # API key authentication for external integrations
│   │       ├── controllers/              # 65+ request handlers (one per domain entity)
│   │       │   ├── authController.js
│   │       │   ├── userController.js
│   │       │   ├── leadController.js
│   │       │   ├── employeeController.js
│   │       │   ├── internController.js
│   │       │   ├── attendanceController.js
│   │       │   ├── leaveController.js
│   │       │   ├── courseController.js
│   │       │   ├── moduleController.js
│   │       │   ├── lessonController.js
│   │       │   ├── enrollmentController.js
│   │       │   ├── quizController.js
│   │       │   ├── assignmentController.js
│   │       │   ├── clientController.js
│   │       │   ├── subscriptionController.js
│   │       │   ├── taskController.js
│   │       │   ├── transactionController.js
│   │       │   ├── invoiceController.js
│   │       │   ├── paymentController.js
│   │       │   ├── recurringScheduleController.js
│   │       │   ├── liveQuizController.js
│   │       │   ├── forumController.js
│   │       │   ├── badgeController.js
│   │       │   ├── communicationController.js
│   │       │   ├── templateController.js
│   │       │   ├── providerController.js
│   │       │   ├── jobController.js
│   │       │   ├── candidateController.js
│   │       │   ├── interviewController.js
│   │       │   ├── integrationController.js
│   │       │   ├── payrollController.js
│   │       │   ├── performanceController.js
│   │       │   ├── calendarController.js
│   │       │   ├── holidayController.js
│   │       │   ├── workflowController.js
│   │       │   ├── approvalController.js
│   │       │   ├── companySettingController.js
│   │       │   ├── jobBoardController.js
│   │       │   ├── projectController.js
│   │       │   ├── mindMapController.js
│   │       │   ├── certificateController.js
│   │       │   ├── monitoringController.js
│   │       │   ├── tenantController.js
│   │       │   ├── marketplaceController.js
│   │       │   ├── cartController.js
│   │       │   ├── couponController.js
│   │       │   ├── orderController.js
│   │       │   ├── reportController.js
│   │       │   ├── scheduledReportController.js
│   │       │   ├── apiKeyController.js
│   │       │   ├── webhookSubscriptionController.js
│   │       │   ├── predictiveController.js
│   │       │   ├── automationController.js
│   │       │   ├── pushNotificationController.js
│   │       │   ├── systemController.js
│   │       │   ├── healthController.js
│   │       │   ├── auditController.js
│   │       │   ├── feedController.js
│   │       │   └── moduleController.js
│   │       ├── models/                   # 60+ Sequelize-style ORM models
│   │       │   ├── User.js, Session.js, Lead.js, ActivityFeed.js, AuditLog.js
│   │       │   ├── SystemConfig.js, Employee.js, Intern.js, Attendance.js
│   │       │   ├── Leave.js, Course.js, Module.js, Lesson.js, Enrollment.js
│   │       │   ├── Quiz.js, Assignment.js, Client.js, Subscription.js, Task.js
│   │       │   ├── Invoice.js, Transaction.js, Payment.js, RecurringSchedule.js
│   │       │   ├── QuizAttempt.js, AssignmentSubmission.js, ForumPost.js
│   │       │   ├── ForumReply.js, Badge.js, UserBadge.js, LiveQuizSession.js
│   │       │   ├── ProviderConfig.js, CommunicationTemplate.js, CommunicationLog.js
│   │       │   ├── Job.js, Candidate.js, Interview.js, Integration.js
│   │       │   ├── SalaryStructure.js, Payroll.js, PerformanceReview.js
│   │       │   ├── CalendarEvent.js, Holiday.js, Workflow.js, ApprovalChain.js
│   │       │   ├── ApprovalInstance.js, CompanySetting.js, JobBoardPost.js
│   │       │   ├── StudentProject.js, MindMapNode.js, Certificate.js
│   │       │   ├── SystemErrorLog.js, Tenant.js, TenantUser.js
│   │       │   ├── Product.js, Coupon.js, CartSession.js, Order.js, OrderItem.js
│   │       │   ├── ReportDefinition.js, ScheduledReport.js, ApiKey.js
│   │       │   ├── WebhookSubscription.js, DeviceRegistration.js
│   │       │   ├── PredictionLog.js, AutomationWorkflow.js, WorkflowNode.js
│   │       │   ├── WorkflowExecution.js, AnomalyLog.js
│   │       │   └── ...
│   │       ├── routes/                   # 50+ route files mounted under /api/v1
│   │       │   ├── index.js              # Central router mount point
│   │       │   ├── authRoutes.js, userRoutes.js, leadRoutes.js, feedRoutes.js
│   │       │   ├── auditRoutes.js, systemRoutes.js, healthRoutes.js, employeeRoutes.js
│   │       │   ├── internRoutes.js, attendanceRoutes.js, leaveRoutes.js
│   │       │   ├── courseRoutes.js, moduleRoutes.js, lessonRoutes.js
│   │       │   ├── enrollmentRoutes.js, quizRoutes.js, assignmentRoutes.js
│   │       │   ├── clientRoutes.js, subscriptionRoutes.js, taskRoutes.js
│   │       │   ├── transactionRoutes.js, invoiceRoutes.js, paymentRoutes.js
│   │       │   ├── recurringScheduleRoutes.js
│   │       │   ├── liveQuizRoutes.js, forumRoutes.js, badgeRoutes.js
│   │       │   ├── communicationRoutes.js, templateRoutes.js, providerRoutes.js
│   │       │   ├── jobRoutes.js, candidateRoutes.js, interviewRoutes.js
│   │       │   ├── integrationRoutes.js, payrollRoutes.js, performanceRoutes.js
│   │       │   ├── calendarRoutes.js, holidayRoutes.js, workflowRoutes.js
│   │       │   ├── approvalRoutes.js, companySettingRoutes.js
│   │       │   ├── jobBoardRoutes.js, projectRoutes.js, mindMapRoutes.js
│   │       │   ├── certificateRoutes.js, monitoringRoutes.js
│   │       │   ├── tenantRoutes.js, marketplaceRoutes.js, cartRoutes.js
│   │       │   ├── orderRoutes.js, couponRoutes.js, reportRoutes.js, scheduledReportRoutes.js
│   │       │   ├── apiKeyRoutes.js, webhookRoutes.js
│   │       │   ├── predictiveRoutes.js, automationRoutes.js, notificationRoutes.js
│   │       │   └── ...
│   │       ├── services/                 # Business logic & external integrations
│   │       │   ├── socketService.js, emailService.js, smsService.js
│   │       │   ├── whatsappService.js, encryptionService.js
│   │       │   ├── integrationService.js, calendarSyncService.js
│   │       │   ├── certificateGenerator.js, pdfGenerator.js, payrollCalculator.js
│   │       │   ├── paymentService.js, searchService.js, reportGenerator.js
│   │       │   ├── webhookProcessor.js, webhookDispatcher.js
│   │       │   ├── pushNotificationService.js, mlService.js
│   │       │   ├── linkedinService.js, jobBoardService.js, internshalaService.js
│   │       │   ├── indeedService.js, githubService.js, elasticsearchService.js
│   │       │   ├── dataWarehouseSync.js, anomalyDetectionService.js
│   │       │   ├── workflowEngine.js, whiteLabelService.js
│   │       │   └── ...
│   │       └── socket/
│   │           ├── index.js              # Socket.IO server bootstrap
│   │           └── handlers.js           # Event handlers (lead_created, new_activity, etc.)
│   │
│   └── frontend/
│       ├── package.json                  # React 19, Redux Toolkit, React Router DOM v6, Axios, Framer Motion
│       ├── vite.config.js                # Vite multi-page config (index.html + admin.html)
│       ├── admin.html                    # Admin portal entry point
│       ├── .env.example
│       └── src/
│           ├── main.jsx                  # Public site bootstrap (ReactDOM.createRoot)
│           ├── admin.jsx                 # Admin portal bootstrap
│           ├── AdminApp.jsx              # Admin router tree with PrivateRoute guards
│           ├── App.jsx                   # Public marketing site router
│           ├── auth/
│           │   ├── index.js
│           │   ├── components/LoginForm.jsx
│           │   └── pages/
│           │       ├── Auth.module.css
│           │       ├── ForgotPasswordPage.jsx
│           │       └── LoginPage.jsx
│           ├── common/
│           │   ├── components/
│           │   │   ├── AdminPage/AdminPage.jsx
│           │   │   ├── Avatar/Avatar.jsx
│           │   │   ├── Badge/Badge.jsx
│           │   │   ├── Button/Button.jsx
│           │   │   ├── Card/Card.jsx
│           │   │   ├── DataTable/DataTable.jsx, DataTable.module.css
│           │   │   ├── Dropdown/Dropdown.jsx
│           │   │   ├── Input/Input.jsx
│           │   │   ├── Modal/Modal.jsx
│           │   │   ├── PrivateRoute/PrivateRoute.jsx
│           │   │   ├── Spinner/Spinner.jsx
│           │   │   ├── Toast/Toast.jsx, ToastContainer.jsx
│           │   │   └── ...
│           │   ├── contexts/
│           │   │   ├── AuthContext.jsx      # Login state, session validation, socket token
│           │   │   ├── SocketContext.jsx    # Socket.IO client connection
│           │   │   └── ThemeContext.jsx     # Light/dark theme state
│           │   ├── hooks/
│           │   │   ├── useAuth.js
│           │   │   ├── useDebounce.js
│           │   │   ├── useLocalStorage.js
│           │   │   ├── useNotification.js
│           │   │   └── useSocket.js
│           │   ├── layout/
│           │   │   ├── MainLayout.jsx
│           │   │   ├── Navbar.jsx
│           │   │   └── Sidebar.jsx
│           │   └── utils/
│           │       ├── constants.js
│           │       ├── dateUtils.js
│           │       ├── errorHandler.js
│           │       ├── permissions.js       # Stub (empty object)
│           │       └── validators.js
│           ├── components/
│           │   ├── about/ (CTAabout, CTAJoin, Hero, Introduction, Leadership, Projects, Team, VisionMission)
│           │   ├── career/ (CareerApply, CareerContent, CareerHero)
│           │   ├── home/ (AboutPreview, Activities, ContactForm, CTA, Hero, Marquee, ProjectsPreview, ServicesSlider, Testimonials)
│           │   ├── projects/ (Ethiroliseminar..., GlamersGathering, JciDigitalSkills, jci/*)
│           │   └── shared/ (comming_soon, Footer, Navbar, PremiumMotionProvider, ScrollToTopBtn, WhatsAppBtn)
│           ├── modules/                     # Feature modules (each with components/ and index.js)
│           │   ├── approvals/
│           │   ├── audit/
│           │   ├── automation/
│           │   ├── calendar/
│           │   ├── communication/
│           │   ├── crm/
│           │   ├── developer-portal/
│           │   ├── feed/
│           │   ├── finance/
│           │   ├── gamification/
│           │   ├── hrms/
│           │   ├── integrations/
│           │   ├── interviews/
│           │   ├── jobs/
│           │   ├── jobsBoard/
│           │   ├── lms/
│           │   ├── marketplace/
│           │   ├── mindmap/
│           │   ├── monitoring/
│           │   ├── multi-tenant/
│           │   ├── pms/
│           │   ├── predictive/
│           │   ├── projects/
│           │   ├── reporting/
│           │   └── settings/
│           ├── pages/
│           │   ├── About.jsx, Career.jsx, Contact.jsx, Home.jsx
│           │   ├── project_home.jsx, services.jsx
│           ├── public/
│           │   └── assets/images
│           ├── roles/                      # 11 role-scoped admin dashboards
│           │   ├── admin/index.js + pages/ (AIAnalytics, Approvals, AuditLogs, AutomationStudio, Calendar, Communications, Dashboard, DeveloperPortal, Finance, Gamification, HR, Integrations, Interviews, JobsBoard, Leads, LMS, Marketplace, Monitoring, PMS, Reports, Users)
│           │   ├── employee/index.js + pages/ (Approvals, Calendar, Dashboard, Leaves, Payslips, Performance, Tasks)
│           │   ├── finance/index.js + pages/ (Dashboard, Expenses, Income, Invoices, Payments, Payroll, Schedules)
│           │   ├── hr/index.js + pages/ (Attendance, Communications, Dashboard, Employees, Interns, Interviews, JobsBoard, Leaves, Payroll, Performance)
│           │   ├── intern/index.js + pages/ (Calendar, Dashboard, Projects, Tasks)
│           │   ├── project-manager/index.js + pages/ (Approvals, Calendar, Clients, CompanySettings, Dashboard, Settings, Subscriptions, Tasks)
│           │   ├── public/pages/ (Checkout, CourseCatalog, CourseDetail)
│           │   ├── reception/index.js + pages/ (Attendance, Calendar, Communications, Dashboard)
│           │   ├── sales/index.js + pages/ (Dashboard, FollowUps, Leads)
│           │   ├── student/index.js + pages/ (Certificates, CoursePlayer, Courses, Dashboard, Forum, LiveQuiz, MindMap, Profile, Projects, Quiz)
│           │   ├── super-admin/index.js + components/ + pages/ (Approvals, AuditLogs, Calendar, Communications, Dashboard, Finance, Gamification, HR, Integrations, Interviews, JobsBoard, Leads, LMS, Monitoring, PMS, Settings, SystemSearch, Tenants, Users)
│           │   └── tutor/index.js + pages/ (Communications, CourseCurriculum, Courses, Dashboard, Forum, Students)
│           ├── services/
│           │   ├── adminApi.js, authService.js, leadService.js, userService.js
│           │   └── api/                     # 50+ Axios API clients
│           │       ├── axiosInstance.js
│           │       ├── authApi.js, userApi.js, leadApi.js, employeeApi.js
│           │       ├── attendanceApi.js, leaveApi.js, courseApi.js, moduleApi.js
│           │       ├── lessonApi.js, enrollmentApi.js, quizApi.js, assignmentApi.js
│           │       ├── clientApi.js, subscriptionApi.js, taskApi.js
│           │       ├── transactionApi.js, invoiceApi.js, paymentApi.js
│           │       ├── liveQuizApi.js, forumApi.js, badgeApi.js
│           │       ├── communicationApi.js, templateApi.js, providerApi.js
│           │       ├── jobApi.js, candidateApi.js, interviewApi.js
│           │       ├── integrationApi.js, payrollApi.js, performanceApi.js
│           │       ├── calendarApi.js, holidayApi.js, workflowApi.js
│           │       ├── approvalApi.js, companySettingApi.js
│           │       ├── jobBoardApi.js, projectApi.js, mindMapApi.js
│           │       ├── certificateApi.js, monitoringApi.js
│           │       ├── tenantApi.js, marketplaceApi.js, cartApi.js
│           │       ├── couponApi.js, reportApi.js, scheduledReportApi.js
│           │       ├── apiKeyApi.js, webhookApi.js
│           │       ├── predictiveApi.js, automationApi.js
│           │       ├── notificationApi.js, feedApi.js, auditApi.js
│           │       ├── systemApi.js, searchApi.js, candidateApi.js
│           │       └── ...
│           ├── store/
│           │   ├── index.js                 # Redux store configuration
│           │   ├── hooks.js                 # Typed useDispatch / useSelector
│           │   └── slices/                  # 30+ Redux Toolkit slices
│           │       ├── authSlice.js, usersSlice.js, leadsSlice.js
│           │       ├── employeesSlice.js, attendanceSlice.js, leavesSlice.js
│           │       ├── coursesSlice.js, enrollmentsSlice.js, quizzesSlice.js
│           │       ├── clientsSlice.js, tasksSlice.js, invoicesSlice.js
│           │       ├── transactionsSlice.js, paymentsSlice.js, payrollSlice.js
│           │       ├── communicationsSlice.js, templatesSlice.js, jobsSlice.js
│           │       ├── interviewsSlice.js, candidatesSlice.js
│           │       ├── integrationsSlice.js, calendarSlice.js, holidaySlice.js
│           │       ├── approvalsSlice.js, companySettingsSlice.js
│           │       ├── projectsSlice.js, mindmapSlice.js, certificatesSlice.js
│           │       ├── monitoringSlice.js, tenantsSlice.js, productsSlice.js
│           │       ├── cartSlice.js, ordersSlice.js, couponsSlice.js
│           │       ├── reportsSlice.js, apiKeysSlice.js, webhooksSlice.js
│           │       ├── predictiveSlice.js, automationSlice.js
│           │       ├── pushNotificationsSlice.js, feedSlice.js, auditSlice.js
│           │       ├── uiSlice.js, badgesSlice.js, performanceSlice.js
│           │       └── ...
│           ├── styles/
│           │   ├── global.css, admin.css, premium-motion.css
│           │   ├── EthiroliStyles.css, home-hero.css
│           │   ├── career-apply.css, contact-page.css, jcidigitalskills.css
│           └── utils/
│               └── registerServiceWorker.js
│
├── ethiroli-vue/
│   ├── package.json                      # Vue 3, vue-router, Vite
│   ├── vite.config.js
│   ├── index.html
│   ├── .vscode/extensions.json
│   ├── public/ (assets/images, .htaccess, vite.svg)
│   └── src/
│       ├── main.js
│       ├── App.vue
│       ├── router.js
│       ├── style.css
│       ├── assets/ (vue.svg, css/global.css, images/)
│       ├── components/
│       │   ├── HelloWorld.vue
│       │   ├── about/ (Hero, Introduction, VisionMission)
│       │   ├── career/
│       │   ├── contact/
│       │   ├── home/ (AboutPreview, Activities, ContactForm, CTA, Hero, Marquee, ProjectsPreview, ServicesSlider, Testimonials)
│       │   └── shared/ (CountUp, Footer, Navbar, ScrollToTopBtn, WhatsAppBtn)
│       └── views/ (About, Career, Contact, Home)
│
└── docs/                                  # Referenced in README but not present in repo
```

---

## 3. File-Level Analysis

### 3.1 Backend Core

| File | Purpose | Interactions |
|------|---------|--------------|
| `backend/src/server.js` | Bootstraps the Express HTTP server on port 5000 and a standalone Socket.IO server on port 3003. Seeds a default `SUPER_ADMIN` user (`admin@ethiroli.com` / `123`) if none exists. | Imports `app.js`, `socket/index.js`, `config/database.js`, and dynamically imports `models/User.js` for seeding. |
| `backend/src/app.js` | Configures the Express middleware stack: custom cookie parser, CORS (dev-permissive), JSON/URL-encoded body parsing, global API rate limiting (`/api`), CSRF protection (`/api`), and mounts the central router. Exports the app instance. | Imports `routes/index.js`, `middleware/errorHandler.js`, `middleware/csrf.js`, `middleware/rateLimiter.js`. |
| `backend/src/db.js` | Creates a `mysql2/promise` connection pool with configurable host, port, user, password, and database name. | Imported by most models and some controllers. |
| `backend/src/config/database.js` | **Duplicate pool** created identically to `db.js`. Used only by `server.js` for seeding. **Risk**: two pools can cause connection exhaustion. | Imported by `server.js`. |
| `backend/src/config/encryption.js` | Provides AES-256-GCM encryption/decryption with PBKDF2 key derivation (100k iterations) for sensitive fields (provider tokens, API keys). | Used by `models/` and `services/encryptionService.js`. |
| `backend/src/config/migrate.js` | Runs pending SQL migrations against the database. | Invoked manually or during deployment. |
| `backend/src/config/logger.js` | Structured logging utility (likely Winston or Pino wrapper). | Used by controllers and services. |
| `backend/src/config/constants.js` | Shared constants (status enums, allowed origins, role names). | Referenced across middleware and controllers. |
| `backend/schema.sql` | Defines **65+ tables** including `users`, `sessions`, `leads`, `employees`, `interns`, `attendance`, `leaves`, `courses`, `modules`, `lessons`, `enrollments`, `quizzes`, `assignments`, `clients`, `subscriptions`, `tasks`, `invoices`, `transactions`, `payments`, `recurring_schedules`, `forum_posts`, `forum_replies`, `badges`, `user_badges`, `live_quiz_sessions`, `provider_configs`, `communication_templates`, `communication_logs`, `jobs`, `candidates`, `interviews`, `integrations`, `salary_structures`, `payroll`, `performance_reviews`, `calendar_events`, `holidays`, `workflows`, `approval_chains`, `approval_instances`, `company_settings`, `job_board_posts`, `student_projects`, `mind_map_nodes`, `certificates`, `system_error_logs`, `tenants`, `tenant_users`, `products`, `coupons`, `cart_sessions`, `orders`, `order_items`, `report_definitions`, `scheduled_reports`, `api_keys`, `webhook_subscriptions`, `device_registrations`, `prediction_logs`, `automation_workflows`, `workflow_nodes`, `workflow_executions`, `anomaly_logs`, etc. | Source of truth for DB structure; used by migration runner and models. |

### 3.2 Backend Middleware

| File | Purpose | Interactions |
|------|---------|--------------|
| `middleware/auth.js` | Validates session tokens from cookies, attaches `req.user`. | Applied to protected routes before controllers. |
| `middleware/rbac.js` | Exports `requireRole(...allowedRoles)` and `requireLeadOwnerOrAdmin`. Returns 403 if `req.user.role` is not in the allowed list. | Used in route definitions to guard endpoints. |
| `middleware/csrf.js` | Validates `Origin`/`Referer` headers against `ALLOWED_ORIGINS`. | Applied globally to `/api`. |
| `middleware/rateLimiter.js` | Global 100 req/min limiter + stricter 5 attempts/15min login limiter. | Applied globally to `/api`. |
| `middleware/validation.js` | Schema-level request payload validation (Zod/Joi style). | Used in route definitions. |
| `middleware/tenantResolver.js` | Resolves tenant context from subdomain, header, or query parameter. | Applied globally via `routes/index.js`. |
| `middleware/errorHandler.js` | Catches async errors, formats JSON error responses. | Mounted at end of `app.js`. |
| `middleware/apiKeyAuth.js` | Validates `X-API-Key` headers for server-to-server or public API access. | Used on webhook and integration routes. |

### 3.3 Backend Controllers & Routes

Each controller handles CRUD and domain logic for a specific entity. Each route file mounts endpoints under `/api/v1/<resource>` (or nested paths). The `routes/index.js` file imports all route modules and mounts them sequentially.

**Phase-based organization:**

- **Phase 1**: Auth, Users, Leads, Activity Feed, Audit Logs, System Config
- **Phase 2**: Employees, Interns, Attendance, Leaves, Courses, Modules, Lessons, Enrollments, Quizzes, Assignments, Clients, Subscriptions, Tasks
- **Phase 3**: Transactions, Invoices, Payments, Live Quiz, Forum, Badges
- **Phase 4**: Communications, Templates, Providers, Jobs, Candidates, Interviews, Integrations
- **Phase 5**: Payroll, Performance, Calendar, Holidays, Workflows, Approvals, Company Settings
- **Phase 6**: Job Board, Projects, Mind Maps, Certificates, Monitoring
- **Phase 7**: Tenants, Marketplace, Cart, Coupons, Reports, Scheduled Reports, API Keys, Webhooks
- **Phase 8**: Predictive AI, Automation, Push Notifications

### 3.4 Backend Services

Services encapsulate business logic that spans multiple models or requires external integrations:
- **Communication**: `emailService.js`, `smsService.js`, `whatsappService.js` — send messages via configured providers.
- **Integration**: `integrationService.js`, `calendarSyncService.js` — sync with Google Calendar, Zoom, etc.
- **Document Generation**: `certificateGenerator.js`, `pdfGenerator.js` — generate PDFs/certificates.
- **Finance**: `payrollCalculator.js`, `paymentService.js` — compute payroll, process payments.
- **Search/Reporting**: `searchService.js`, `reportGenerator.js` — full-text search and scheduled report generation.
- **AI/Automation**: `mlService.js` (lead scoring/churn prediction), `workflowEngine.js` (automation execution).
- **Job Board**: `linkedinService.js`, `jobBoardService.js`, `internshalaService.js`, `indeedService.js` — post jobs to external platforms.
- **Dev Tools**: `githubService.js` — parse GitHub repos for student projects.
- **Infra**: `webhookProcessor.js`, `webhookDispatcher.js`, `pushNotificationService.js`, `elasticsearchService.js`, `dataWarehouseSync.js`, `anomalyDetectionService.js`, `whiteLabelService.js`.

### 3.5 Backend Socket.IO

- `socket/index.js`: Creates a standalone HTTP server on port 3003 and initializes Socket.IO.
- `socket/handlers.js`: Registers event handlers (`lead_created`, `lead_status_changed`, `new_activity`, typing indicators, read receipts, online presence). Broadcasts are **role-scoped** (e.g., finance events only sent to `FINANCE`/`ADMIN` rooms).

### 3.6 React Frontend — Public Marketing Site

| File | Purpose | Interactions |
|------|---------|--------------|
| `src/main.jsx` | Entry point for the public site. Renders `App.jsx` into `#root`. | Imports `App.jsx` and global styles. |
| `src/App.jsx` | Public marketing router. Lazy-loads `Home`, `About`, `Career`, `Contact`, `Services`, `project_home`. Includes shared `Navbar`, `Footer`, `ScrollToTopBtn`, `WhatsAppBtn`, and a preloader. | Uses React Router DOM. No Redux or API calls — purely static content. |
| `src/pages/*.jsx` | Static marketing pages (Home, About, Career, Contact, Services, project_home). | Import components from `src/components/`. |
| `src/components/` | Reusable UI sections: `about/*`, `career/*`, `home/*`, `projects/*`, `shared/*`. | Consumed by marketing pages. |
| `src/styles/*.css` | Scoped stylesheets for marketing pages and animations. | Imported by components/pages. |

### 3.7 React Frontend — Admin Portal

| File | Purpose | Interactions |
|------|---------|--------------|
| `src/admin.jsx` | Entry point for the admin portal. Renders `AdminApp.jsx` into `#admin-root`. | Imports `AdminApp.jsx`. |
| `src/AdminApp.jsx` | Defines the **entire admin route tree** using React Router DOM v6. Wraps routes in `PrivateRoute` guards keyed to 11 roles. Public routes: `/admin/login`, `/marketplace/*`. Redirects `/` to `/admin/dashboard`. | Imports all role page components, `PrivateRoute`, `MainLayout`, contexts. |
| `src/common/contexts/AuthContext.jsx` | Provides login/logout/session validation. Stores auth token and user profile. | Consumed by `AdminApp.jsx`, role pages, `useAuth` hook. |
| `src/common/contexts/SocketContext.jsx` | Manages Socket.IO client connection, listens for real-time events. | Consumed by dashboards and modules needing live updates. |
| `src/common/contexts/ThemeContext.jsx` | Manages light/dark theme preference. | Consumed by `MainLayout` and all page components. |
| `src/common/components/PrivateRoute/PrivateRoute.jsx` | Redirects unauthenticated users to `/admin/login`. Restricts access based on `allowedRoles` prop. | Wraps every admin route group in `AdminApp.jsx`. |
| `src/common/layout/MainLayout.jsx` | Shell layout: renders `Navbar`, `Sidebar`, and `<Outlet />` for child routes. | Wraps all authenticated admin pages. |
| `src/common/utils/permissions.js` | **Stub**: exports an empty object `{}`. No granular permission mapping is currently implemented in the frontend. | Intended for UI-level permission checks; not yet wired. |

### 3.8 React Frontend — Modules

Each module under `src/modules/<name>/` contains an `index.js` barrel export and a `components/` directory with feature-specific UI. They are **not** standalone routes; instead, their components are composed into role pages or shared layouts.

| Module | Key Components | Role Integration |
|--------|---------------|------------------|
| `approvals` | ApprovalDetail, ApprovalQueue, WorkflowBuilder | SUPER_ADMIN, ADMIN, HR, PM, EMPLOYEE |
| `audit` | AuditTable | SUPER_ADMIN, ADMIN |
| `automation` | AutomationCanvas, NodeProperties, WorkflowCanvas, WorkflowExecution | SUPER_ADMIN, ADMIN |
| `calendar` | CalendarView, EventModal, HolidayForm, HolidayList | All roles |
| `communication` | CommunicationCenter, ComposeModal, LogViewer, ProviderConfig, TemplateEditor, TemplateList | HR, ADMIN, SUPER_ADMIN |
| `crm` | FollowUpDrawer, KanbanBoard, KanbanColumn, LeadCard, LeadModal | SALES, ADMIN, SUPER_ADMIN |
| `developer-portal` | ApiKeyManager, ApiPlayground, WebhookTester | SUPER_ADMIN, ADMIN |
| `feed` | FeedItem, FeedSidebar | All roles |
| `finance` | ExpenseForm, FinanceDashboard, GSTCalculator, IncomeForm, InvoiceGenerator, InvoiceList, PaymentTracker, RecurringSchedule | FINANCE, ADMIN, SUPER_ADMIN |
| `gamification` | BadgeCriteria, BadgeList, EarnedBadges | All roles |
| `hrms` | AttendanceGrid, EmployeeTable, InternTable, LeaveApprovalModal, LeaveRequestList, PayrollForm, PayrollHistory, PayrollRunForm, PayslipViewer, PerformanceReview, SalaryStructureForm | HR, FINANCE, ADMIN, SUPER_ADMIN |
| `integrations` | IntegrationCard, IntegrationConfig, IntegrationTest | SUPER_ADMIN, ADMIN |
| `interviews` | CandidatePipeline, FeedbackForm, IndeedWebhook, InterviewForm, InterviewList, JobPostingForm, JobPostingList | HR, ADMIN, SUPER_ADMIN |
| `jobs` | JobBoardList, PostToPlatforms | HR, ADMIN, SUPER_ADMIN |
| `jobsBoard` | JobPostingForm, JobPostingList, PlatformConfig | HR, ADMIN, SUPER_ADMIN |
| `lms` | AssignmentSubmit, BadgeDisplay, CertificateViewer, CourseEditor, CourseList, CoursePlayer, EnrollmentList, ForumPostDetail, ForumReplyForm, ForumThread, ForumThreadList, LessonViewer, LiveQuizLeaderboard, LiveQuizSession, ModuleEditor, QuizTaking, StudentProgressCard | STUDENT, TUTOR, ADMIN, SUPER_ADMIN |
| `marketplace` | CartDrawer, CheckoutForm, CouponManager, PublicCouponList, SalesDashboard | PUBLIC, ADMIN, SUPER_ADMIN |
| `mindmap` | MindMapEditor, MindMapNodeModal | STUDENT, ADMIN, SUPER_ADMIN |
| `monitoring` | ErrorLogTable, ErrorTracking, HealthDashboard, ResolutionForm, ServiceHealth | SUPER_ADMIN, ADMIN |
| `multi-tenant` | TenantDashboard, TenantForm, TenantList, WhiteLabelConfig | SUPER_ADMIN |
| `pms` | ClientList, CompanySettings, CompanySettingsForm, InvoiceFromSubscription, SubscriptionForm, SubscriptionManagement, TaskBoard | PROJECT_MANAGER, ADMIN, SUPER_ADMIN |
| `predictive` | ChurnDashboard, ExplainabilityPanel, LeadScoreCard, ModelRetrain | SUPER_ADMIN, ADMIN |
| `projects` | BranchTracker, GitHubRepoList, GitHubRepoListForm, RepoParser | STUDENT, ADMIN, SUPER_ADMIN |
| `reporting` | ExportScheduler, ReportBuilder, ReportViewer, ScheduledReportList | SUPER_ADMIN, ADMIN, FINANCE |
| `settings` | ConfigForm | SUPER_ADMIN |
| `users` | UserFilters, UserFormModal, UserTable | SUPER_ADMIN, ADMIN |

### 3.9 React Frontend — Store (Redux)

`src/store/index.js` configures the Redux store with **30+ slices**. Each slice corresponds to a domain entity and provides `createAsyncThunk`-based CRUD operations plus local state management.

| Slice | Domain |
|-------|--------|
| `authSlice` | Authentication state, session, user profile |
| `usersSlice` | User management |
| `leadsSlice` | CRM lead pipeline |
| `employeesSlice` | Employee directory |
| `attendanceSlice` | Attendance records |
| `leavesSlice` | Leave requests |
| `coursesSlice`, `enrollmentsSlice`, `quizzesSlice` | LMS |
| `clientsSlice`, `tasksSlice`, `projectsSlice` | PMS |
| `invoicesSlice`, `transactionsSlice`, `paymentsSlice`, `payrollSlice` | Finance |
| `communicationsSlice`, `templatesSlice` | Communication Center |
| `jobsSlice`, `interviewsSlice`, `candidatesSlice` | Recruitment |
| `integrationsSlice` | Third-party integrations |
| `calendarSlice`, `holidaySlice` | Calendar |
| `approvalsSlice` | Workflow approvals |
| `companySettingsSlice` | PMS/company configuration |
| `mindmapSlice`, `certificatesSlice` | Student tools |
| `monitoringSlice` | System monitoring |
| `tenantsSlice`, `productsSlice`, `cartSlice`, `ordersSlice`, `couponsSlice` | Multi-tenant marketplace |
| `reportsSlice` | Reporting |
| `apiKeysSlice`, `webhooksSlice` | Developer portal |
| `predictiveSlice`, `automationSlice`, `pushNotificationsSlice` | AI/Automation |
| `feedSlice`, `auditSlice` | Real-time activity |
| `uiSlice` | Global UI state (sidebar, modals) |
| `badgesSlice`, `performanceSlice` | Gamification & HR |

### 3.10 React Frontend — Services (API Layer)

`src/services/api/axiosInstance.js` configures the base Axios client with credentials and default base URL. Each subsequent API file (e.g., `authApi.js`, `leadApi.js`) wraps endpoints for a specific domain resource.

| Service File | Domain |
|-------------|--------|
| `authApi.js` | Login, logout, session validation |
| `userApi.js` | User CRUD |
| `leadApi.js` | Lead pipeline |
| `employeeApi.js`, `internApi.js` | HRMS |
| `attendanceApi.js`, `leaveApi.js` | Attendance & leave |
| `courseApi.js`, `moduleApi.js`, `lessonApi.js`, `enrollmentApi.js` | LMS |
| `quizApi.js`, `assignmentApi.js` | Assessments |
| `clientApi.js`, `subscriptionApi.js`, `taskApi.js` | PMS |
| `transactionApi.js`, `invoiceApi.js`, `paymentApi.js` | Finance |
| `liveQuizApi.js`, `forumApi.js`, `badgeApi.js` | LMS engagement |
| `communicationApi.js`, `templateApi.js`, `providerApi.js` | Communication Center |
| `jobApi.js`, `candidateApi.js`, `interviewApi.js` | Recruitment |
| `integrationApi.js` | Integrations |
| `payrollApi.js`, `performanceApi.js` | HRMS finance |
| `calendarApi.js`, `holidayApi.js` | Calendar |
| `workflowApi.js`, `approvalApi.js`, `companySettingApi.js` | Operations |
| `jobBoardApi.js`, `projectApi.js`, `mindMapApi.js`, `certificateApi.js` | Extended features |
| `monitoringApi.js` | System health |
| `tenantApi.js`, `marketplaceApi.js`, `cartApi.js`, `couponApi.js` | Multi-tenant |
| `reportApi.js`, `scheduledReportApi.js` | Reporting |
| `apiKeyApi.js`, `webhookApi.js` | Developer tools |
| `predictiveApi.js`, `automationApi.js`, `notificationApi.js` | AI/Automation |
| `feedApi.js`, `auditApi.js`, `systemApi.js`, `searchApi.js` | System |

### 3.11 Vue Frontend

| File | Purpose | Interactions |
|------|---------|--------------|
| `src/main.js` | Vue 3 app bootstrap with router and global styles. | Imports `App.vue`, `router.js`, `style.css`. |
| `src/App.vue` | Root component with `<router-view />`. | Hosts all public views. |
| `src/router.js` | Vue Router 4 configuration with scroll behavior. | Maps `/`, `/about`, `/career`, `/contact` to view components. |
| `src/views/*.vue` | Public pages: `Home.vue`, `About.vue`, `Career.vue`, `Contact.vue`. | Compose `components/home/*`, `components/about/*`, `components/career/*`, `components/contact/*`. |
| `src/components/home/*` | Reusable home page sections (Hero, AboutPreview, Activities, ContactForm, CTA, Marquee, ProjectsPreview, ServicesSlider, Testimonials). | Consumed by `Home.vue`. |
| `src/components/about/*` | About page sections (Hero, Introduction, VisionMission). | Consumed by `About.vue`. |
| `src/components/shared/*` | Cross-cutting components: `Navbar.vue`, `Footer.vue`, `ScrollToTopBtn.vue`, `WhatsAppBtn.vue`, `CountUp.vue`. | Used across all views. |
| `public/assets/images/*` | Static image assets (banner, founder, services, team, video). | Referenced via absolute paths in Vue templates. |

---

## 4. Action Plan

### Immediate Priorities

1. **Fix Duplicate Database Pool**
   - `backend/src/db.js` and `backend/src/config/database.js` create identical pools. Standardize on one (`db.js`) and update `server.js` to import it. Remove the redundant `config/database.js` or alias it to prevent connection exhaustion.

2. **Implement Frontend Permissions**
   - `frontend/src/common/utils/permissions.js` is an empty stub. Populate it with a role-to-capability map (e.g., `SUPER_ADMIN: ['*']`, `FINANCE: ['invoices:read', 'payments:write']`) and wire it into `PrivateRoute` and button/table visibility logic.

3. **Wire RECEPTION Role**
   - The `RECEPTION` role exists in the database schema and `AdminApp.jsx` route tree has a placeholder, but no dedicated pages or backend controller actions are implemented. Build `reception/pages/Dashboard.jsx`, `Attendance.jsx`, `Calendar.jsx`, `Communications.jsx`, and corresponding backend slices/routes.

4. **Replace Hardcoded Credentials**
   - `backend/src/server.js` seeds `admin@ethiroli.com` with password `123`. Move seeding to a proper migration script with an environment-gated flag. Ensure `.env.example` does not encourage default passwords in production.

5. **Unify Public and Admin Frontends**
   - The public React site (`App.jsx`) and admin portal (`AdminApp.jsx`) are completely separate entry points with no shared auth or API state. Consider sharing `AuthContext`, `SocketContext`, and API services between them, or clearly document the separation.

### Short-Term Improvements

6. **Add Missing Documentation**
   - `README.md` references `SETUP.md` and `docs/API-ROUTES.md`, neither of which exists. Create `SETUP.md` with environment setup, database migration, SSL, and deployment steps. Generate `docs/API-ROUTES.md` from route files or OpenAPI spec.

7. **Stabilize CORS Configuration**
   - `app.js` currently allows any origin in dev (`callback(null, true)`). Replace with a strict `ALLOWED_ORIGINS` allowlist from `.env` before production deployment.

8. **Add Test Coverage**
   - No test directories or test scripts exist. Introduce Jest/Vitest for frontend unit tests and Jest/SuperTest for backend API integration tests, starting with auth, RBAC, and core entity controllers.

9. **Complete Stub Dashboards**
   - Several role pages (e.g., `student/pages/Dashboard.jsx`, `intern/pages/Dashboard.jsx`) display hardcoded mock data. Replace with Redux slices and API calls.

10. **Audit RBAC Consistency**
    - Verify every route file applies `requireRole` with the correct role set. Some routes may be missing guards, and `requireLeadOwnerOrAdmin` is defined but not audited for consistent use.

### Medium-Term Roadmap

11. **Replace Custom Cookie Parser**
    - `app.js` uses a naive cookie parser. Replace with the `cookie-parser` npm package for robustness and standards compliance.

12. **Introduce API Versioning Strategy**
    - Routes are mounted under `/api/v1`. Document deprecation policy and add versioned route directories (`/api/v2/...`) for breaking changes.

13. **Add E2E Tests**
    - Use Playwright or Cypress to cover critical user journeys (login, lead creation, leave approval, course enrollment, payment flow).

14. **Optimize Bundle Size**
    - The React admin portal imports all role pages eagerly in `AdminApp.jsx`. Implement code-splitting with `React.lazy()` + `Suspense` for role-specific chunks.

15. **Implement Granular Frontend Permissions**
    - Extend `permissions.js` to support field-level and action-level checks (e.g., `canEditInvoice`, `canDeleteEmployee`) and apply them in `DataTable` and `Modal` components.

---

## 5. Role-Based Access Control (RBAC)

### 5.1 Role Definitions

The system defines **11 distinct roles**, validated both by the backend `requireRole` middleware and the frontend `PrivateRoute` component.

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

### 5.2 Permission Matrix

| Capability / Route Area | SUPER_ADMIN | ADMIN | HR | TUTOR | PROJECT_MANAGER | FINANCE | SALES | RECEPTION | EMPLOYEE | STUDENT | INTERN |
|------------------------|:-----------:|:-----:|:--:|:-----:|:---------------:|:-------:|:-----:|:---------:|:--------:|:-------:|:------:|
| **Auth & User Management** |
| Login / Logout | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| View Users | ✓ | ✓ | — | — | — | — | — | — | — | — | — |
| Create / Edit / Delete Users | ✓ | ✓ | — | — | — | — | — | — | — | — | — |
| View Own Profile | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **CRM & Leads** |
| View Leads | ✓ | ✓ | ✓ | — | — | — | ✓ | — | — | — | — |
| Create / Edit Leads | ✓ | ✓ | ✓ | — | — | — | ✓ | — | — | — | — |
| Delete Leads | ✓ | ✓ | — | — | — | — | — | — | — | — | — |
| Follow-up Emails | ✓ | ✓ | ✓ | — | — | — | ✓ | — | — | — | — |
| **HRMS** |
| View / Manage Employees | ✓ | ✓ | ✓ | — | — | — | — | — | — | — | — |
| View / Manage Interns | ✓ | ✓ | ✓ | — | — | — | — | — | — | — | — |
| Attendance (all records) | ✓ | ✓ | ✓ | — | — | — | — | ✓ | — | — | — |
| Own Attendance | ✓ | ✓ | ✓ | — | — | — | — | ✓ | ✓ | — | — |
| Leave Management (all) | ✓ | ✓ | ✓ | — | — | — | — | ✓ | — | — | — |
| Own Leave Requests | ✓ | ✓ | ✓ | — | — | — | — | ✓ | ✓ | — | — |
| Payroll Processing | ✓ | ✓ | ✓ | — | — | ✓ | — | — | — | — | — |
| View Own Payslip | ✓ | ✓ | ✓ | — | — | ✓ | — | — | ✓ | — | — |
| Performance Reviews | ✓ | ✓ | ✓ | — | — | — | — | — | ✓ | — | — |
| Interviews | ✓ | ✓ | ✓ | — | — | — | — | — | — | — | — |
| **LMS** |
| View / Manage Courses | ✓ | ✓ | ✓ | ✓ | — | — | — | — | — | — | — |
| Manage Curriculum (Modules/Lessons) | ✓ | ✓ | ✓ | ✓ | — | — | — | — | — | — | — |
| View Enrollments | ✓ | ✓ | ✓ | ✓ | — | — | — | — | — | — | — |
| Take Quizzes / Submit Assignments | ✓ | ✓ | ✓ | ✓ | — | — | — | — | — | ✓ | — |
| Grade Submissions | ✓ | ✓ | ✓ | ✓ | — | — | — | — | — | — | — |
| Forum (read/write) | ✓ | ✓ | ✓ | ✓ | — | — | — | — | — | ✓ | — |
| Live Quiz Hosting | ✓ | ✓ | ✓ | ✓ | — | — | — | — | — | ✓ | — |
| Badges & Certificates | ✓ | ✓ | ✓ | ✓ | — | — | — | — | — | ✓ | — |
| **Finance** |
| View Income / Expenses | ✓ | ✓ | — | — | — | ✓ | — | — | — | — | — |
| Create / Edit Invoices | ✓ | ✓ | — | — | — | ✓ | — | — | — | — | — |
| Track Payments | ✓ | ✓ | — | — | — | ✓ | — | — | — | — | — |
| Recurring Schedules | ✓ | ✓ | — | — | — | ✓ | — | — | — | — | — |
| Payroll Runs | ✓ | ✓ | — | — | — | ✓ | — | — | — | — | — |
| **PMS** |
| View / Manage Clients | ✓ | ✓ | — | — | ✓ | — | — | — | — | — | — |
| Subscriptions | ✓ | ✓ | — | — | ✓ | — | — | — | — | — | — |
| Tasks | ✓ | ✓ | — | — | ✓ | — | — | — | ✓ | — | — |
| Invoices (PMS) | ✓ | ✓ | — | — | ✓ | — | — | — | — | — | — |
| Company Settings | ✓ | ✓ | — | — | ✓ | — | — | — | — | — | — |
| **System & Operations** |
| Audit Logs | ✓ | ✓ | — | — | — | — | — | — | — | — | — |
| System Config | ✓ | — | — | — | — | — | — | — | — | — | — |
| Integrations | ✓ | ✓ | — | — | — | — | — | — | — | — | — |
| Monitoring | ✓ | ✓ | — | — | — | — | — | — | — | — | — |
| Calendar (all events) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ | — | — |
| Holidays Management | ✓ | ✓ | ✓ | — | — | — | — | — | — | — | — |
| Approvals (all workflows) | ✓ | ✓ | ✓ | — | ✓ | — | — | — | ✓ | — | — |
| Global Search | ✓ | ✓ | — | — | — | — | — | — | — | — | — |
| **Multi-Tenant** |
| Tenant Management | ✓ | — | — | — | — | — | — | — | — | — | — |
| Marketplace | ✓ | ✓ | — | — | — | — | — | — | — | ✓ | — |
| Reports | ✓ | ✓ | — | — | — | ✓ | — | — | — | — | — |
| **Developer Tools** |
| API Keys | ✓ | ✓ | — | — | — | — | — | — | — | — | — |
| Webhooks | ✓ | ✓ | — | — | — | — | — | — | — | — | — |
| AI Analytics / Automation | ✓ | ✓ | — | — | — | — | — | — | — | — | — |

### 5.3 RBAC Implementation Notes

- **Backend**: `middleware/rbac.js` exports `requireRole(...allowedRoles)`. Each route file applies it inline (e.g., `router.get('/', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), controller.list)`).
- **Frontend**: `PrivateRoute` component accepts an `allowedRoles` array and redirects unauthorized users to `/admin/login`. Nested routes in `AdminApp.jsx` use route-element guards to cascade permissions.
- **Gap**: The frontend `permissions.js` utility is a stub. There is no centralized permission registry; role checks are duplicated across `AdminApp.jsx` and individual page components.
- **Socket.IO**: Role-scoped rooms are used for real-time broadcasts. For example, finance-related events are emitted only to `FINANCE` and `ADMIN` socket rooms.

---

## 6. Technical Specifications

### 6.1 Technology Stack

| Layer | Technology | Version / Notes |
|-------|-----------|-----------------|
| **Backend Runtime** | Node.js | ES Modules (`"type": "module"`) |
| **Backend Framework** | Express.js | 4.21+ |
| **Database** | MySQL | mysql2/promise connection pool |
| **Real-Time** | Socket.IO | Standalone server on port 3003 |
| **Authentication** | express-session + bcrypt | Session cookies, 10 salt rounds |
| **Encryption** | AES-256-GCM + PBKDF2 | 100k iterations for sensitive fields |
| **Frontend Framework** | React 19 | 19.2.0 |
| **Frontend Build** | Vite | 7.3.1 |
| **State Management** | Redux Toolkit | 2.12.0 |
| **Routing** | React Router DOM | 6.30.3 |
| **HTTP Client** | Axios | 1.19.0 |
| **Animations** | Framer Motion | 12.34.3 |
| **Vue Frontend** | Vue 3 + Vue Router 4 | Vite-powered public site |

### 6.2 Backend Dependencies

```json
{
  "bcrypt": "^5.1.1",
  "cors": "^2.8.6",
  "dotenv": "^16.6.1",
  "express": "^4.21.2",
  "express-session": "^1.19.0",
  "mysql2": "^3.15.3",
  "socket.io": "^4.8.3"
}
```

### 6.3 React Frontend Dependencies

```json
{
  "@reduxjs/toolkit": "^2.12.0",
  "axios": "^1.19.0",
  "framer-motion": "^12.34.3",
  "react": "^19.2.0",
  "react-animations": "^1.0.0",
  "react-dom": "^19.2.0",
  "react-redux": "^9.3.0",
  "react-router-dom": "^6.30.3",
  "socket.io-client": "^4.8.3"
}
```

### 6.4 Architecture & Design Patterns

- **Modular Monolith**: Backend uses a classic Express monolith with feature-based controller/route/service/model grouping.
- **Service Layer Pattern**: Complex business logic (payroll, PDF generation, ML predictions, job board posting) is isolated in `src/services/`.
- **Middleware Pipeline**: Cross-cutting concerns (auth, RBAC, CSRF, rate limiting, tenant resolution, error handling) are implemented as Express middleware.
- **Socket.IO Dual-Server**: HTTP API and real-time events run on separate ports (5000 and 3003) for scalability.
- **Redux Toolkit Slices**: Frontend state is normalized by domain entity, with async thunks for API synchronization.
- **Role-Based UI Rendering**: Admin portal uses nested `PrivateRoute` components and role-guarded route groups.
- **Multi-Tenancy**: Tenant context is resolved per-request via `tenantResolver.js` and applied to DB queries (schema supports `tenant_id` on most tables).

### 6.5 Security Specifications

| Control | Implementation |
|---------|---------------|
| Password Storage | bcrypt with 10 salt rounds |
| Session Management | express-session with last-login-wins rotation |
| CSRF Protection | Origin/Referer validation against `ALLOWED_ORIGINS` allowlist |
| Field Encryption | AES-256-GCM with PBKDF2-derived key (100k iterations) for API tokens, keys, and sensitive PII |
| Rate Limiting | 100 req/min global; 5 login attempts per 15 minutes |
| Server-to-Server Auth | `INTERNAL_SECRET` header with timing-safe comparison |
| CORS | Configurable origin allowlist (currently permissive in dev) |
| Role-Scoped Broadcasts | Socket.IO rooms ensure users only receive data relevant to their role |

### 6.6 Database Schema Highlights

- **Users & Sessions**: `users` table stores role, email (deterministic-encrypted), password hash, and profile fields. `sessions` table tracks active sessions for rotation.
- **Lead Pipeline**: `leads` table uses a `status` ENUM (`NEW`, `CONTACTED`, `DEMO`, `COUNSELLING`, `ADMISSION`, `PAYMENT`, `LOST`).
- **LMS Hierarchy**: `courses` → `modules` → `lessons`. `enrollments` links students to courses. `quizzes` and `assignments` support timed assessments and file submissions.
- **HRMS**: `employees` and `interns` have separate tables with dedicated salary and stipend structures. `attendance` supports check-in/check-out. `leaves` has an approval workflow linked to `approval_chains`.
- **Finance**: `invoices` follow `DRAFT` → `SENT` → `PAID` lifecycle. `recurring_schedules` automate invoice generation. `payroll` references `salary_structures`.
- **Approvals**: Generic `workflows`, `approval_chains`, and `approval_instances` tables support multi-step approval for leaves, expenses, leads, etc.
- **Multi-Tenant**: `tenants` and `tenant_users` tables enable white-labeling and data isolation.
- **Marketplace**: `products`, `cart_sessions`, `orders`, `order_items`, `coupons` support e-commerce functionality.
- **AI/Automation**: `prediction_logs`, `automation_workflows`, `workflow_nodes`, `workflow_executions`, `anomaly_logs` support predictive scoring and workflow automation.

### 6.7 Known Limitations & Risks

1. **Duplicate DB Pool**: Two separate connection pools (`db.js` and `config/database.js`) risk connection exhaustion under load.
2. **Unimplemented RECEPTION Role**: Defined in schema but lacks pages, controllers, and slices.
3. **Empty Permissions Stub**: `permissions.js` provides no frontend-level access control.
4. **Hardcoded Dev Credentials**: Default admin password (`123`) is seeded and `.env.example` contains default DB password (`Admin@123`).
5. **Permissive CORS**: Dev configuration allows all origins; must be locked down for production.
6. **No Test Suite**: No unit, integration, or E2E tests are present.
7. **Eager Admin Bundle**: `AdminApp.jsx` imports all role pages synchronously, increasing initial bundle size.
8. **Public/Admin Split**: Public marketing site and admin portal share no code, auth, or state management.

---

*Generated on 2026-09-08 — Ethiroli Pvt Ltd (Private)*