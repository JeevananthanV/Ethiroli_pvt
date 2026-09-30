# Ethiroli HR Management Portal — Comprehensive Operating & Technical Guide

---

## 1. Overview & Core Philosophy

The **Ethiroli HR Management Portal** is a unified, multi-cohort People Operations platform designed for Ethiroli Pvt Ltd. It connects and governs the entire lifecycle across three distinct learning and talent groups:

```text
  ┌───────────────────────┐
  │  Course Enquiries &   │
  │  Career Applications  │
  └───────────┬───────────┘
              │
      ┌───────┴───────┐
      ▼               ▼
┌───────────┐   ┌───────────┐
│  Students │   │ Job / Intern│
│ (Courses) │   │ Candidates  │
└─────┬─────┘   └─────┬─────┘
      │               │
      │         ┌─────┴─────┐
      │         ▼           ▼
      │   ┌───────────┐┌───────────┐
      │   │  Interns  ││ Employees │
      │   └─────┬─────┘└─────┬─────┘
      │         │           │
      ▼         ▼           ▼
┌───────────────────────────────────┐
│     Configurable Onboarding       │
│  (15 / 30 / 45 / 60 / 90 Days)   │
└─────────────────┬─────────────────┘
                  │
                  ▼
┌───────────────────────────────────┐
│   Training Pathways & Tracking    │
│  (Tutor / Mentor Pairing & LMS %) │
└─────────────────┬─────────────────┘
                  │
                  ▼
┌───────────────────────────────────┐
│    Performance Review Matrix      │
│     (1–5 Metric Evaluations)      │
└─────────────────┬─────────────────┘
                  │
                  ▼
┌───────────────────────────────────┐
│    HR Operations & Helpdesk       │
│ (Dynamic Letters, Requests, Vault)│
└─────────────────┬─────────────────┘
                  │
                  ▼
┌───────────────────────────────────┐
│    4-Tier Offboarding Clearance   │
│  (IT, Access, KT, Finance, HR)    │
└─────────────────┬─────────────────┘
                  │
                  ▼
┌───────────────────────────────────┐
│   People Analytics & CSV Export   │
└───────────────────────────────────┘
```

---

## 2. Access Boundaries & Separation of Concerns

To avoid feature duplication and ensure operational security, clear boundaries exist between portals:

| Portal | Scope & Key Responsibilities | Out of Scope / Delegated |
|---|---|---|
| **HR Portal** (`/app/hr/*`) | • Course admissions & payment verification<br>• Student enrollment & certificate sign-off<br>• Candidate 1-click conversion to Employee / Intern<br>• Configurable onboarding plans (15–90 days) & checklists<br>• 360° employee & intern directory management<br>• Training track assignment & progress oversight<br>• Milestone performance scorecards (1–5 scale)<br>• HR letter generation (Offer, Certificate, Relieving)<br>• HR helpdesk requests (WFH, salary certificates)<br>• 4-Tier offboarding & clearance<br>• People analytics & CSV exports | • Interactive video streaming<br>• In-browser coding playground / code sandbox<br>• Interactive daily quiz execution<br>• General accounting ledger & statutory tax filings (Finance)<br>• Multi-tenant database partition provisioning (Super Admin) |
| **Tutor / LMS Portal** (`/app/tutor/*`, `/app/student/*`) | • Course syllabus & module tree<br>• Video player & lesson delivery<br>• Coding playground & automated test suites<br>• Daily quizzes & assignment grading<br>• Discussion forum & doubt clearance | • Student payment collection verification<br>• Certificate validity clearance<br>• Employee / Intern contracts & HR records |
| **Finance Portal** (`/app/finance/*`) | • Chart of accounts & general ledger<br>• Invoices, billing & balance sheets<br>• Vendor payouts & taxation | • Employee day-to-day HR records & reviews |
| **Super Admin** (`/app/super-admin/*`) | • Multi-tenant management & DB migrations<br>• Global system settings & security logs | • Departmental HR operational tasks |

---

## 3. Sidebar Navigation Structure

```text
HR PORTAL NAVIGATION
│
├── 📊 Dashboard (/app/hr/dashboard)
│
├── 👥 PEOPLE
│   ├── Employees (/app/hr/employees)
│   ├── Interns (/app/hr/interns)
│   └── Students (/app/hr/students)
│
├── 🎯 RECRUITMENT
│   ├── Jobs Board (/app/hr/jobs-board)
│   ├── Job Applications (/app/hr/applications)
│   ├── Interviews (/app/hr/interviews)
│   └── Offers (/app/hr/offers)
│
├── 🚀 ONBOARDING
│   ├── Onboarding (/app/hr/onboarding)
│   ├── Onboarding Plans (/app/hr/onboarding-plans)
│   └── Checklists (/app/hr/checklists)
│
├── ⚡ WORKFORCE
│   ├── Attendance (/app/hr/attendance)
│   ├── Leaves (/app/hr/leaves)
│   ├── Training (/app/hr/training)
│   └── Performance (/app/hr/performance)
│
├── 📁 HR OPERATIONS
│   ├── Payroll (/app/hr/payroll)
│   ├── Documents (/app/hr/documents)
│   ├── HR Letters (/app/hr/letters)
│   ├── HR Requests (/app/hr/requests)
│   └── Announcements (/app/hr/announcements)
│
├── 🚪 OFFBOARDING
│   └── Exit / Offboarding (/app/hr/offboarding)
│
├── 💬 COMMUNICATION
│   └── Website Inquiries (/app/hr/inquiries)
│
└── 📈 REPORTS
    └── HR Reports (/app/hr/reports)
```

---

## 4. Module Specifications & Standard Operating Procedures (SOPs)

### 4.1. Dashboard (`/app/hr/dashboard`)
- **8 Core KPI Cards**:
  1. `Employees`: Active full-time employees
  2. `Interns`: Active interns across college cohorts
  3. `Students`: Enrolled course learners
  4. `New Joiners`: Onboarded within the last 30 days
  5. `Pending Onboarding`: Joiners with pending checklist items
  6. `Interviews Today`: Scheduled candidate interviews
  7. `Documents Pending`: Files awaiting HR verification
  8. `Reviews Due`: Pending 15/30/60/90-day reviews
- **Live Widgets**: Attendance ratio gauge, quick actions bar, and priority action queue.

---

### 4.2. Students Module (`/app/hr/students`)
- **Lifecycle Funnel**:
  `Lead` → `Enquiry` → `Registered` → `Payment` → `Enrolled` → `Training` → `Completed` → `Certificate`
- **Key Actions**:
  - Search & filter by course (Full Stack, AI/ML, Cloud DevOps, UI/UX), payment status (`PAID`, `PARTIAL`, `PENDING`, `OVERDUE`), and certificate status.
  - Audit tuition fee records, LMS progress %, and attendance rate.
  - Approve & issue official completion certificates with 1 click.

---

### 4.3. Employees Module (`/app/hr/employees`)
- **Lifecycle Funnel**:
  `Candidate` → `Selected` → `Offer Sent` → `Offer Accepted` → `Onboarding` → `Active` → `Notice Period` → `Exited`
- **360° Profile Tabs**:
  1. `Overview`: Core designation, manager, CTC, and attendance score.
  2. `Personal & Employment`: Department, work mode (Hybrid, On-site, Remote), joining date.
  3. `Attendance & Leaves`: Monthly attendance rate, remaining leave quotas.
  4. `Payroll & Compensation`: CTC breakdown, bank details.
  5. `Training & Performance`: Active courses, review ratings.
  6. `Assets & Requests`: Issued hardware assets (laptops, monitors).
  7. `Onboarding & Exit`: Onboarding plan progress and exit records.

---

### 4.4. Interns Module (`/app/hr/interns`)
- **Lifecycle Funnel**:
  `Applied` → `Interview` → `Selected` → `Offer` → `Onboarding` → `Training` → `Project` → `Evaluation` → `Completed`
- **Key Details**:
  - College & Degree (e.g. PSG Tech, Anna University CEG, SSN).
  - Internship Track (Frontend, AI/ML, Cloud, Backend, UI/UX).
  - Tech Mentor & Project Manager assignments.
  - Assigned Live Capstone Project & PPO evaluation scorecard.

---

### 4.5. Configurable Onboarding Suite
- **Onboarding Plans (`/app/hr/onboarding-plans`)**:
  - Employee Plans: 30-Day, 60-Day, 90-Day Probation Plans.
  - Intern Plans: 15-Day, 30-Day, 45-Day, 60-Day Technical Plans.
  - Phase structure:
    - *Phase 1 (Day 1–3)*: Orientation, KYC verification, Workstation setup.
    - *Phase 2 (Day 4–15)*: Architecture KT, training modules, buddy intro.
    - *Phase 3 (Day 16–25)*: First live task / sprint ticket ownership.
    - *Phase 4 (Day 26–30)*: Milestone evaluation, sign-off & confirmation.
- **Onboarding Checklists (`/app/hr/checklists`)**:
  - Task-level verification for joiners across HR, IT, Team Lead, and Security.

---

### 4.6. Career Applications & 1-Click Conversion (`/app/hr/applications`)
- **Conversion Workflows**:
  - **Convert to Employee**: Select applicant → Click "Convert to Employee" → Specify Designation, Department, Manager, CTC, and Joining Date → Auto-generates full Employee record.
  - **Convert to Intern**: Select applicant → Click "Convert to Intern" → Specify College, Degree, Mentor, Track, Duration, and Start Date → Auto-generates Intern record.

---

### 4.7. Website Inquiries Funnel Routing (`/app/hr/inquiries`)
- **Triage Workflow**:
  - `Course Enquiry` → Convert to **Student Lead** (`/app/hr/students`)
  - `Job Enquiry` → Convert to **Job Candidate** (`/app/hr/applications`)
  - `Internship Enquiry` → Convert to **Intern Candidate** (`/app/hr/interns`)

---

### 4.8. Training Pathways & Progress Oversight (`/app/hr/training`)
- Assign role-specific training pathways (Student, Intern, Employee).
- Pair dedicated tutor or senior engineer mentor.
- Audit real-time LMS progress percentage, module milestones, and completion status.

---

### 4.9. Performance Review Scorecards (`/app/hr/performance`)
- **Review Schedules**:
  - Employees: 30-Day, 60-Day, 90-Day Probation & Annual Reviews.
  - Interns: 15-Day, 30-Day, 45-Day, 60-Day & Final PPO Evaluations.
- **7-Point Metric Matrix (1 to 5 Stars)**:
  1. Technical Skills
  2. Task Completion & Speed
  3. Attendance & Punctuality
  4. Communication & Responsiveness
  5. Teamwork & Collaboration
  6. Problem Solving & Initiative
  7. Project Milestone Performance
- Qualitative mentor, manager, and HR decision feedback.

---

### 4.10. HR Letters Generator (`/app/hr/letters`)
- **Templates Included**:
  1. Employment Offer Letter
  2. Letter of Appointment
  3. Internship Offer Letter
  4. Internship Completion Certificate
  5. Experience Letter
  6. Relieving & No-Dues Letter
- **Dynamic Variables**:
  `{{employee_name}}`, `{{designation}}`, `{{department}}`, `{{joining_date}}`, `{{manager}}`, `{{salary}}`, `{{duration}}`, `{{college_name}}`, `{{current_date}}`.
- Built-in live interactive preview with 1-click **Print / Save as PDF**.

---

### 4.11. HR Requests & Helpdesk (`/app/hr/requests`)
- **Categories**: Work from Home, Salary Certificate, Experience Letter, Document Request, Profile Correction, Bank Details Update, Address Change.
- **Lifecycle**: `Pending` → `In Review` → `Approved` / `Rejected` → `Completed`.

---

### 4.12. Documents Compliance Vault (`/app/hr/documents`)
- Multi-category vault: Employee Documents, Intern Documents, Student Documents.
- Verification status: `Uploaded` → `Under Review` → `Verified` / `Rejected`.
- Automatic tracking of file sizes, expiry dates, and verifying HR officer.

---

### 4.13. Offboarding & 4-Tier Clearance Hub (`/app/hr/offboarding`)
- **4-Tier Department Clearance**:
  1. `IT & Assets`: Laptop, monitors, and security tokens returned.
  2. `Systems & Access`: GitHub, Slack, VPN, and email accounts revoked.
  3. `Manager & KT`: Knowledge transfer, documentation, and handovers complete.
  4. `Finance & Accounts`: Final settlement, pending expenses, and no-dues cleared.
  5. `HR Exit Interview`: Exit interview completed, feedback documented, and Relieving Letter generated.

---

### 4.14. People Analytics & Reports (`/app/hr/reports`)
- Comprehensive headcount analytics across Employees (42), Interns (18), and Students (126).
- Student course completion rates, Intern PPO conversion percentage, and Onboarding SLA tracking.
- Instant 1-click CSV download and modal preview.

---

## 5. API Endpoint Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/v1/hr/dashboard/metrics` | Retrieves KPI card totals and dashboard statistics |
| `GET` | `/v1/students` | Searches and filters enrolled students |
| `POST` | `/v1/students` | Registers a new student in a course |
| `PATCH` | `/v1/students/:id` | Updates student payment, progress, or certificate status |
| `GET` | `/v1/employees` | Retrieves employee directory |
| `POST` | `/v1/employees` | Creates a new employee record |
| `PATCH` | `/v1/employees/:id` | Updates employee details or employment state |
| `GET` | `/v1/interns` | Retrieves intern directory with college & mentor pairings |
| `POST` | `/v1/interns` | Registers a new intern |
| `PATCH` | `/v1/interns/:id` | Updates internship status or live project info |
| `GET` | `/v1/onboarding-plans` | Fetches configurable 15–90 day onboarding plans |
| `POST` | `/v1/onboarding-plans` | Creates a new custom onboarding plan |
| `GET` | `/v1/hr-requests` | Retrieves HR helpdesk requests |
| `POST` | `/v1/hr-requests` | Creates a new HR request |
| `PATCH` | `/v1/hr-requests/:id` | Updates status (Approved, Rejected, Completed) |
| `POST` | `/v1/candidates/:id/convert-employee` | Converts job applicant into full employee |
| `POST` | `/v1/candidates/:id/convert-intern` | Converts candidate into college intern |
| `POST` | `/v1/contact-messages/:id/convert` | Routes website inquiry to student lead or candidate |
| `GET` | `/v1/documents` | Lists compliance document vault |
| `POST` | `/v1/documents` | Uploads document for verification |
| `GET` | `/v1/performance` | Lists performance review records |
| `POST` | `/v1/performance` | Submits 7-metric scorecard evaluation |
| `GET` | `/v1/exit-requests` | Lists offboarding requests |
| `POST` | `/v1/exit-requests` | Initiates exit clearance workflow |
| `PATCH` | `/v1/exit-requests/:id` | Updates 4-tier clearance checklist items |
| `GET` | `/v1/reports` | Returns people analytics summary |

---

## 6. Access Control & RBAC Permissions Matrix

| Module | HR Read | HR Create | HR Update | HR Delete | Notes |
|---|:---:|:---:|:---:|:---:|---|
| **Employees** | ✅ | ✅ | ✅ | ✅ | Full employee lifecycle management |
| **Interns** | ✅ | ✅ | ✅ | ✅ | College intern records & live projects |
| **Students** | ✅ | ✅ | ✅ | ❌ | Course admissions, fees & certificates |
| **Candidates & Jobs** | ✅ | ✅ | ✅ | ✅ | 1-click conversions to employee/intern |
| **Website Inquiries** | ✅ | ❌ | ✅ | ✅ | Funnel routing & triage |
| **Onboarding Plans** | ✅ | ✅ | ✅ | ✅ | Configurable 15–90 day plans & checklists |
| **Attendance** | ✅ | ✅ | ✅ | ✅ | Check-ins, corrections & audits |
| **Leaves** | ✅ | ✅ | ✅ | ✅ | Leave approvals & quota management |
| **Training Tracks** | ✅ | ✅ | ✅ | ❌ | Pathway assignment & progress audits |
| **Performance Reviews** | ✅ | ✅ | ✅ | ❌ | 7-point scorecard evaluations |
| **HR Helpdesk Requests** | ✅ | ✅ | ✅ | ❌ | Approvals for WFH, certificates, updates |
| **HR Letters Generator** | ✅ | ✅ | ✅ | ❌ | Dynamic placeholder templates & PDF |
| **Document Vault** | ✅ | ✅ | ✅ | ✅ | Identity, academic & KYC verification |
| **Offboarding Clearance** | ✅ | ✅ | ✅ | ❌ | 4-tier department sign-offs |
| **Reports & Analytics** | ✅ | ✅ | ❌ | ❌ | Cohort metrics & CSV exports |

---

## 7. Troubleshooting & FAQ

### Q1: Why is a student not seeing their course modules in the LMS?
> **Answer**: Ensure the student's enrollment status in the HR Portal (`/app/hr/students`) is marked as `Enrolled` or `Active` and that payment status is verified (`PAID` or approved `PARTIAL`).

### Q2: What happens when a Candidate is converted to an Employee or Intern?
> **Answer**: The system automatically:
> 1. Updates the candidate's application status to `CONVERTED`.
> 2. Creates a corresponding User account and Profile record in the Employee/Intern directory.
> 3. Assigns the designated default onboarding plan based on role and duration.

### Q3: How do dynamic variables work in HR Letters?
> **Answer**: The generator parses tokens in double curly braces (e.g. `{{employee_name}}`, `{{salary}}`, `{{joining_date}}`) and binds them in real-time from the active selection modal before generating the print/PDF view.

---

*Last Updated: 2026-09-30 | Ethiroli Pvt Ltd Human Resources Management System*
