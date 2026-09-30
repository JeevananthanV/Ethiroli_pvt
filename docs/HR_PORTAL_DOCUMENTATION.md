# Ethiroli HR Management Portal — Comprehensive System Specification & Workflow Blueprint

## 1. Executive Summary & Core Philosophy

The **Ethiroli HR Management Portal** is the central people-operations ecosystem for Ethiroli Pvt Ltd. Rather than functioning solely as a traditional employee database, it manages the complete end-to-end organizational lifecycle:

```text
Course Selling & Inquiries
           ↓
   Student Enrollees
           ↓
    Internship Track
           ↓
   Employee Selection
           ↓
Configurable Onboarding
           ↓
Training & LMS Monitoring
           ↓
   Performance Reviews
           ↓
  Operations & Helpdesk
           ↓
   4-Tier Offboarding
           ↓
People Analytics & Reports
```

---

## 2. Architecture & Clear Separation of Concerns

To prevent feature duplication and maintain a clean separation of responsibilities across portals:

```text
┌──────────────────────────────────────────────┐       ┌──────────────────────────────────────────────┐
│           HR / PEOPLE PORTAL                 │       │           TUTOR / LMS PORTAL                 │
├──────────────────────────────────────────────┤       ├──────────────────────────────────────────────┤
│ • Course Admissions & Payment Verification   │       │ • Interactive Video Player                   │
│ • Student Enrollment & Tuition Status        │       │ • Modules, Lessons & Coding Playground       │
│ • Tutor & Mentor Pairing                     │       │ • Daily Tasks, Assignments & Code Drills     │
│ • Training Milestone Progress Tracking (%)   │       │ • Live Quizzes & Automatic Assessment        │
│ • Official Certificate Issuance Clearance    │       │ • Student Doubts & Technical Forum           │
└──────────────────────┬───────────────────────┘       └──────────────────────┬───────────────────────┘
                       │                                                      │
                       └──────────────────► REST APIs & WebSockets ◄──────────┘
```

1. **HR vs LMS**:
   - **HR Portal**: Assigns training pathways, monitors cohort progress, audits tuition fee payments, and authorizes certificate generation.
   - **LMS Portal**: Delivers actual educational lessons, code sandboxes, and video modules.
2. **HR vs Finance**:
   - **HR Portal**: Manages employee compensation structures, salary components, attendance multipliers, and payroll run triggers.
   - **Finance Portal**: Manages general ledger, accounts payable/receivable, client invoices, and statutory tax compliance.
3. **HR vs Super Admin**:
   - **HR Portal**: Operates within the organizational tenant to manage recruitment, joiners, and workforce governance.
   - **Super Admin**: Provisions multi-tenant database partitions, system integrations, and global feature flags.

---

## 3. Sidebar Navigation Hierarchy

The sidebar is organized into clean, functional sections:

```text
HR MANAGEMENT PORTAL
│
├── Dashboard (/app/hr/dashboard)
│
├── PEOPLE
│   ├── Employees (/app/hr/employees)
│   ├── Interns (/app/hr/interns)
│   └── Students (/app/hr/students)
│
├── RECRUITMENT
│   ├── Jobs Board (/app/hr/jobs-board)
│   ├── Job Applications (/app/hr/applications)
│   ├── Interviews (/app/hr/interviews)
│   └── Offers (/app/hr/offers)
│
├── ONBOARDING
│   ├── Onboarding (/app/hr/onboarding)
│   ├── Onboarding Plans (/app/hr/onboarding-plans)
│   └── Checklists (/app/hr/checklists)
│
├── WORKFORCE
│   ├── Attendance (/app/hr/attendance)
│   ├── Leaves (/app/hr/leaves)
│   ├── Training (/app/hr/training)
│   └── Performance (/app/hr/performance)
│
├── HR OPERATIONS
│   ├── Payroll (/app/hr/payroll)
│   ├── Documents (/app/hr/documents)
│   ├── HR Letters (/app/hr/letters)
│   ├── HR Requests (/app/hr/requests)
│   └── Announcements (/app/hr/announcements)
│
├── OFFBOARDING
│   └── Exit / Offboarding (/app/hr/offboarding)
│
├── COMMUNICATION
│   └── Website Inquiries (/app/hr/inquiries)
│
└── REPORTS
    └── HR Reports (/app/hr/reports)
```

---

## 4. Module Specifications

### 4.1 Dashboard (`/app/hr/dashboard`)
- **8 Core Metric Cards**:
  1. `Employees` (Active full-time employees)
  2. `Interns` (Active college & technical interns)
  3. `Students` (Active course learners)
  4. `New Joiners` (Joined within the last 30 days)
  5. `Pending Onboarding` (Joiners with open checklist items)
  6. `Interviews Today` (Scheduled candidate evaluations)
  7. `Documents Pending` (Uploaded files awaiting HR verification)
  8. `Reviews Due` (Probation check-ins & quarterly reviews)
- **Workforce Attendance Gauge**: Real-time present vs on-leave ratios.
- **Priority Action Queue**: Live notifications for pending leave approvals, career applications, and WFH requests.

---

### 4.2 Students Module (`/app/hr/students`)
- **Purpose**: Oversight of student course admissions, fee verification, and certification.
- **Fields**:
  - `Student ID`, `Full Name`, `Email`, `Phone`
  - `Course Enrolled` (e.g. MERN Full Stack, Python Data Science & AI, Cloud DevOps)
  - `Duration & Enrollment Date`
  - `Payment Status` (`PAID`, `PARTIAL`, `PENDING`, `OVERDUE`)
  - `LMS Progress %` & `Attendance Rate %`
  - `Assigned Tutor`
  - `Certificate Status` (`In Progress`, `Verified & Issued`)
- **8-Stage Student Lifecycle**:
  `Lead` → `Enquiry` → `Registered` → `Payment` → `Enrolled` → `Training` → `Completed` → `Certificate`

---

### 4.3 Employees Module (`/app/hr/employees`)
- **Purpose**: Complete 360° employee directory and lifecycle governance.
- **8-Stage Employee Lifecycle**:
  `Candidate` → `Selected` → `Offer Sent` → `Offer Accepted` → `Onboarding` → `Active` → `Notice Period` → `Exited`
- **360° Profile Tabs**:
  1. `Overview`: Quick stats, designation, manager, CTC, and attendance score.
  2. `Personal & Employment`: Department, work mode (Hybrid/On-site/Remote), and joining date.
  3. `Attendance & Leaves`: Monthly attendance rate and leave balances.
  4. `Payroll & Compensation`: Cost to Company (CTC) and salary credit bank coordinates.
  5. `Training & Performance`: Enrolled compliance tracks and evaluation scores.
  6. `Assets & Requests`: Allocated laptops, hardware, and accessories.
  7. `Onboarding & Exit`: Active onboarding plan progression and exit records.

---

### 4.4 Interns Module (`/app/hr/interns`)
- **Purpose**: College intern admissions, mentor pairings, live capstone project assignments, and PPO evaluations.
- **Fields**:
  - `Intern ID`, `Name`, `Contact Coordinates`
  - `College & Degree` (e.g. PSG Tech, SSN, Anna University CEG)
  - `Internship Track` (Frontend, AI/ML, Cloud, UI/UX)
  - `Assigned Tech Mentor` & `Project Manager`
  - `Tenure & Duration` (1, 2, 3, or 6 Months)
  - `Assigned Live Project`
  - `Performance Evaluation Rating` & `Certificate Status`
- **10-Stage Internship Lifecycle**:
  `Applied` → `Interview` → `Selected` → `Offer` → `Onboarding` → `Training` → `Project` → `Evaluation` → `Completed`

---

### 4.5 Configurable Onboarding Suite
- **Onboarding Overview (`/app/hr/onboarding`)**: Active journeys and onboarding dashboard.
- **Onboarding Plans (`/app/hr/onboarding-plans`)**:
  - **Employee Plans**: 30-Day, 60-Day, and 90-Day Probation Plans.
  - **Intern Plans**: 15-Day, 30-Day, 45-Day, and 60-Day Advanced Plans.
  - **Phase-Driven Structure**:
    - `Phase 1 – Orientation & Setup` (Day 1–3)
    - `Phase 2 – Training & Knowledge Transfer` (Day 4–15)
    - `Phase 3 – Live Project Ownership` (Day 16–25)
    - `Phase 4 – Evaluation & Certification` (Day 26–30)
- **Onboarding Checklists (`/app/hr/checklists`)**:
  - Task-level verification for joiners (Document collection, Workstation setup, Git repo access, Manager 1:1, Milestone check-in).

---

### 4.6 Training Pathway Assignment (`/app/hr/training`)
- **HR Workflow**:
  - Create and assign role-specific training pathways (Student, Intern, Employee).
  - Pair dedicated tutor or senior engineer mentor.
  - Monitor live LMS progress percentage and completion milestones.

---

### 4.7 Performance Reviews (`/app/hr/performance`)
- **Review Templates**:
  - **Employee**: 30-Day Review, 60-Day Review, 90-Day Review, Annual Review.
  - **Intern**: 15-Day Review, 30-Day Review, 45-Day Review, 60-Day Review, Final Evaluation.
- **Evaluation Matrix (1 to 5 Score Scale)**:
  1. Technical Skills
  2. Task Completion
  3. Attendance & Punctuality
  4. Communication
  5. Teamwork & Collaboration
  6. Problem Solving
  7. Project Performance
- **Qualitative Inputs**: Mentor feedback, Manager feedback, and HR decision comments.

---

### 4.8 HR Requests & Helpdesk (`/app/hr/requests`)
- **Categories**: Work from Home, Salary Certificate, Experience Letter, Document Request, Profile Correction, Bank Details Update, Address Change, and Custom Queries.
- **Status Workflow**: `Pending` → `In Review` → `Approved` / `Rejected` → `Completed`.

---

### 4.9 HR Letters Generator (`/app/hr/letters`)
- **Standardized Templates**:
  1. Employment Offer Letter
  2. Letter of Appointment
  3. Internship Offer Letter
  4. Internship Completion Certificate
  5. Experience Letter
  6. Relieving & No-Dues Letter
- **Dynamic Placeholders**:
  `{{employee_name}}`, `{{designation}}`, `{{department}}`, `{{joining_date}}`, `{{manager}}`, `{{salary}}`, `{{duration}}`, `{{college_name}}`, `{{current_date}}`.
- **Live Output**: Interactive live preview with 1-click **Print / Save as PDF** formatting.

---

### 4.10 Document Compliance Vault (`/app/hr/documents`)
- **Verification Workflow**: `Uploaded` → `Under Review` → `Verified` / `Rejected`.
- **Categorized Tabs**: Employee Documents, Intern Documents, Student Documents, Pending Verification, Verified, Rejected, and Expiring Documents.
- **Audit Details**: Tracks uploaded file size, expiration dates, and verifying HR official.

---

### 4.11 Recruitment & Candidate Conversion (`/app/hr/applications`)
- **Recruitment Funnel**: `Applied` → `Shortlisted` → `Interview` → `Selected` → `Offer` → `Converted`.
- **1-Click Conversion Modals**:
  - **Candidate → Convert to Employee**: Pre-fills applicant details, prompts for Designation, Department, Manager, CTC, and Joining Date, and automatically generates an Employee record.
  - **Candidate → Convert to Intern**: Pre-fills applicant details, prompts for College, Degree, Mentor, Track, Duration, and Start Date, and automatically initializes an Intern record.

---

### 4.12 Website Inquiries Funnel Routing (`/app/hr/inquiries`)
- **Classification Categories**:
  - `Course Enquiry` $\rightarrow$ Convert to **Student Lead**
  - `Job Enquiry` $\rightarrow$ Convert to **Candidate**
  - `Internship` $\rightarrow$ Convert to **Intern Candidate**
  - `General Enquiry`

---

### 4.13 Offboarding & 4-Tier Clearance Hub (`/app/hr/offboarding`)
- **Clearance Workflow**:
  1. `IT Assets & Laptop Return`
  2. `System Access & VPN Revocation`
  3. `Knowledge Transfer & Codebase Handover`
  4. `Finance No-Dues & Expense Settlement`
  5. `HR Exit Interview & Feedback Recording`
- **Output**: Auto-marks status as `RELIEVED / COMPLETED` upon clearance and prepares official Relieving Letters.

---

### 4.14 People Analytics & Reports (`/app/hr/reports`)
- **Multi-Cohort Analytics**:
  - Headcount distribution across 186 total network members (42 employees, 18 interns, 126 students).
  - Student completion rates & certificate audit trails.
  - Intern PPO recommendation rates (72%).
  - Onboarding SLA adherence (96.2% on-schedule completion).
- **Export Capabilities**: 1-click CSV download and executive modal summaries.

---

## 5. API Endpoint Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/v1/hr/dashboard/metrics` | Retrieves consolidated dashboard KPI counts |
| `GET` | `/v1/students` | Multi-filter search across student enrollees |
| `POST` | `/v1/students` | Enrolls a new student into a course |
| `PATCH` | `/v1/students/:id` | Updates student lifecycle, payment, or progress |
| `GET` | `/v1/employees` | Lists full-time employee directory |
| `POST` | `/v1/employees` | Creates a new employee record |
| `PATCH` | `/v1/employees/:id` | Updates employee details or status |
| `GET` | `/v1/interns` | Lists active interns and mentors |
| `POST` | `/v1/interns` | Enrolls a new intern into a track |
| `PATCH` | `/v1/interns/:id` | Updates internship milestone stage |
| `GET` | `/v1/onboarding-plans` | Lists configurable 15–90 day plans |
| `POST` | `/v1/onboarding-plans` | Creates a custom onboarding plan |
| `GET` | `/v1/hr-requests` | Retrieves HR helpdesk requests |
| `POST` | `/v1/hr-requests` | Submits a new HR request |
| `PATCH` | `/v1/hr-requests/:id` | Updates request status and audit remarks |
| `POST` | `/v1/candidates/:id/convert-employee` | Converts job candidate into employee profile |
| `POST` | `/v1/candidates/:id/convert-intern` | Converts candidate into intern profile |
| `POST` | `/v1/contact-messages/:id/convert` | Routes website inquiry into student or candidate |
| `GET` | `/v1/documents` | Lists compliance document vault |
| `POST` | `/v1/documents` | Uploads document for verification |
| `GET` | `/v1/performance` | Lists performance review records |
| `POST` | `/v1/performance` | Records a performance scorecard evaluation |
| `GET` | `/v1/exit-requests` | Lists offboarding requests |
| `POST` | `/v1/exit-requests` | Initiates resignation / exit workflow |
| `PATCH` | `/v1/exit-requests/:id` | Updates department clearance checklist items |
| `GET` | `/v1/reports` | Retrieves people analytics summaries |

---

## 6. Verification & Production Sync

- **Frontend Bundle**: Compiled via Vite (`12.67s` build time) with zero errors.
- **Static Distribution**: Synced into `backend/public/` for production server hosting.
- **Git Repository**: Synced and pushed to `main` (`efcbd24`).
