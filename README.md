# Ethiroli SaaS Platform

Enterprise-grade all-in-one SaaS platform for training institutes and businesses -- LMS, HRMS, CRM, Finance, Communication, AI, and Real-Time Collaboration.

## Overview

Ethiroli is a comprehensive, single-page application (SPA) SaaS platform built to manage every aspect of a training institute and business operations. From student enrollment and course delivery to employee payroll and client invoicing, Ethiroli unifies 9 core modules into one seamless experience with 120+ API routes.

The platform supports 10 distinct user roles with fine-grained access control, integrates with 35+ external services, and delivers a production-grade experience with CSRF protection, encrypted credentials, role-scoped real-time broadcasts, and a unified Communication Center for Email, SMS, and WhatsApp.

## Key Design Decisions

- **Role-Scoped Broadcasts**: Real-time events routed to specific role groups (finance data only goes to FINANCE/ADMIN, not students).
- **Encrypted Credentials**: Provider API tokens encrypted with AES-256-GCM (PBKDF2 key derivation, 100k iterations).
- **CSRF Protection**: All mutating requests validated via Origin/Referer against ALLOWED_ORIGINS.
- **Session Rotation**: Last-login-wins strategy. Previous sessions invalidated on new login.

## Core Modules (9)

### 1. LMS -- Learning Management System
Full day-structured course delivery with real-time updates:
- Student Portal: Dashboard, course player, quiz taking (timed, auto-scored), assignment submission, attendance tracking (30-day calendar grid with streaks), certificates
- Tutor Content Management: Full CRUD for modules, lessons, quizzes, assignments, and live classes
- AI Doubt Chatbot: Course-context-aware AI assistant with follow-up suggestions, conversation history, bookmark, and markdown export
- Forum: Student discussion board with post/reply, pin/lock, and search
- Live Quiz: Real-time quiz sessions with instant results and leaderboard
- Gamification: Badge system for learning achievements

### 2. HRMS -- Human Resource Management System
- Employee management with departments, designations, salary structures
- Attendance system (check-in/check-out, working hours, late detection)
- Leave management (casual, sick, earned -- approval workflow)
- Intern management with mentors, stipends, and college info
- Payroll processing with salary breakdown (basic, HRA, DA, PF, ESI, TDS)
- Performance reviews

### 3. CRM -- Customer Relationship Management
- Lead pipeline management (NEW -> CONTACTED -> DEMO -> COUNSELLING -> ADMISSION -> PAYMENT -> LOST)
- Source tracking (website, referral, social media, walk-in, phone)
- Multi-step approval workflows for lead conversion
- Follow-up email automation
- Indeed integration for automated candidate import

### 4. Finance
- Income and expense tracking with categories
- Invoice management (generate, send via email, batch-generate from schedules)
- Financial summary dashboard (revenue, expenses, profit margins)
- Payment tracking
- GST calculation
- Recurring invoice schedules

### 5. Communication Center
Unified multi-channel messaging:

| Channel | Provider | Status Tracking |
|---------|----------|-----------------|
| Email | Nodemailer (SMTP) | PENDING -> SENT/FAILED |
| SMS | Twilio / MSG91 | PENDING -> SENT/FAILED/DELIVERED |
| WhatsApp | Meta Cloud API v18 | PENDING -> SENT/FAILED/DELIVERED/READ |

- 16 pre-built email templates (welcome, attendance alerts, interview invitations, payroll slips, etc.)
- Bulk SMS (max 100 recipients)
- Provider-agnostic configuration (stored encrypted in DB)
- Communication log history and aggregate stats

### 6. PMS -- Project Management Service
- Client and service management
- Client-service subscription mapping
- Monthly recurring task management
- Invoice generation and status tracking (DRAFT -> SENT -> PAID)
- Company settings (GST, bank details, logo)
- Dashboard with active clients, revenue, and renewal alerts

### 7. Interviews
- Job posting management
- Multi-round interview scheduling (Round 1, Round 2, HR Round)
- Candidate tracking with ratings and feedback
- Status pipeline (SCHEDULED -> COMPLETED -> SELECTED/REJECTED)
- Indeed webhook integration for automated candidate creation

### 8. System & Operations
- Real-Time: Chat (1:1 with typing indicators), activity feed, online presence, live notifications, role-scoped data changes
- Calendar: Event management with type, assigned users, and real-time broadcast
- Holidays: Public/restricted holiday management
- Approvals: Multi-step workflow system (create chain, approve/reject)
- Audit Logs: Full audit trail with entity, action, user, timestamp
- Global Search: Cross-entity search (Cmd+K) across students, employees, courses, projects, tasks, leads, invoices
- Monitoring: Service health dashboard, error tracking with resolution
- Jobs Board: Multi-platform job posting (LinkedIn, Naukri, Indeed, Internshala)
- Student Projects: GitHub integration with repo parsing and branch tracking
- Mind Map: Knowledge visualization
- Badges & Gamification: Achievement badges with criteria and earned status

## Courses (12)

| # | Course | Code | Duration | Fee (INR) | Modules | Lessons | Description |
|---|--------|------|----------|-----------|---------|---------|-------------|
| 1 | Full Stack Web Development | FSWD-001 | 90 days | 25,000 | 5 | 15+ | Complete MERN stack: React, Node.js, Express, MongoDB |
| 2 | Python Programming | PY-001 | 60 days | 15,000 | -- | -- | Python fundamentals to advanced with Django |
| 3 | Digital Marketing | DM-001 | 45 days | 12,000 | -- | -- | SEO, SEM, social media marketing |
| 4 | Data Science with AI | DSAI-001 | 180 days | 45,000 | -- | -- | Data science, machine learning, AI fundamentals |
| 5 | Mobile App Development | MAD-001 | 90 days | 30,000 | -- | -- | React Native and Flutter mobile development |
| 6 | UI/UX Design | UIUX-001 | 60 days | 18,000 | -- | -- | Interface and experience design with Figma |
| 7 | Web Development Bootcamp | WDB-30D | 30 days | 19,999 | 6 | 30 | Intensive bootcamp: HTML, CSS, JS, React, Node, MongoDB, deployment |
| 8 | MySQL Database Development | MYSQL-20D | 20 days | -- | 5 | 20 | SQL CRUD, joins, subqueries, transactions, Node.js integration |
| 9 | Java Full Stack | JFS-001 | -- | -- | -- | -- | Core Java, Spring Boot, Hibernate, REST APIs |
| 10 | Cloud Computing | CC-001 | -- | -- | -- | -- | AWS, Azure, GCP fundamentals, serverless, containers |
| 11 | DevOps Engineering | DEVOPS-001 | -- | -- | -- | -- | CI/CD, Docker, Kubernetes, Terraform, monitoring |
| 12 | Cybersecurity | CYBER-001 | -- | -- | -- | -- | Network security, ethical hacking, OWASP, compliance |

Courses 1-6 are seeded with the main seed. Courses 7-8 have dedicated detailed seed scripts (30-day and 20-day courses). Courses 9-12 are defined in the system.

## Integration Layer (35+ Services)

The platform manages 35+ integration services across 12 categories via a unified configuration system:

| Category | Services |
|----------|----------|
| Security | Google reCAPTCHA, Cloudflare CDN/WAF |
| Payments | Razorpay, Stripe |
| Communication | WhatsApp Business, Twilio, SendGrid, FCM, Slack |
| Calendar/Meeting | Google Calendar, Google Meet, Zoom |
| Analytics | Google Analytics |
| Automation | N8N, Webhooks |
| CRM/Accounting | Zoho CRM, Zoho Books |
| DevTools | GitHub, GitLab |
| Jobs | LinkedIn, Naukri, Internshala, Indeed |

Each integration supports: enable/disable toggle, connection status, encrypted config storage, test connection, and sync logging.

## User Roles (10)

| Role | Description | Key Access |
|------|-------------|------------|
| SUPER_ADMIN | Full system access | All modules, settings, audit logs |
| ADMIN | Administrative access | Most modules (except some settings) |
| HR | Human Resources | Employees, attendance, leaves, interviews, CRM, calendar |
| TUTOR | Course instructor | Courses, tutor content, student management |
| PROJECT_MANAGER | Project lead | Projects, tasks, clients, approvals, PMS, reports |
| FINANCE | Financial controller | Payroll, finance, invoices, reports |
| SALES | Sales executive | CRM/leads, communication |
| RECEPTION | Front desk | Attendance, calendar, communication |
| EMPLOYEE | Staff member | Tasks, approvals |
| STUDENT | Learner | Student dashboard, courses, quizzes, assignments, chatbot, forum, badges |
| INTERN | Intern | Tasks |

## Real-Time Features

Powered by a standalone Socket.IO service (port 3003) with role-scoped broadcasts:
- Chat: 1:1 messaging with typing indicators, read receipts, online presence
- Notifications: Real-time push notifications per user
- Activity Feed: Role-scoped activity stream (e.g., HR sees attendance events, Finance sees invoice events)
- Data Changes: Live entity updates (new task, lead status change, leave approval)
- Calendar: Event changes broadcast to staff + assigned users
- LMS: Course content updates broadcast to enrolled students
- Attendance: Live check-in/check-out events to HR roles
- Integrations: Indeed candidate alerts to recruitment roles

## Security

| Feature | Implementation |
|---------|----------------|
| CSRF Protection | Origin/Referer validation against ALLOWED_ORIGINS allowlist |
| Password Hashing | bcrypt-ts (10 salt rounds) |
| Field Encryption | AES-256-GCM with PBKDF2 key derivation (100k iterations) |
| Rate Limiting | Login: 5/15min |
| Server-to-Server Auth | INTERNAL_SECRET header with timing-safe comparison |
| Role-Scoped Broadcasts | Data segregation via role-based rooms |
| Session Rotation | Last-login-wins (all prior sessions invalidated) |

## Documentation

| Document | Description |
|----------|-------------|
| README.md | Project overview, architecture, and features (this file) |
| SETUP.md | Complete setup, configuration, security, deployment, troubleshooting |
| docs/API-ROUTES.md | Comprehensive API documentation for all 120+ routes |

## License

Private -- Ethiroli Pvt Ltd