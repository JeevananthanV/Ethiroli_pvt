# HR Access Control & RBAC Matrix

## 1. Role Title and Summary
- **Role**: HR (People Operations)
- **Purpose**: Manages full Ethiroli People Operations lifecycle: course-selling → students → interns → employees → onboarding → training → performance → offboarding. Provides full CRUD for HR-specific resources and read/write for people analytics, compliance documents, and departmental requests.
- **Portal Slug**: `hr`
- **MFA Required**: No (Role-level optional)
- **Session Duration**: 8 hours
- **Cookie Path**: `/app/hr`

---

## 2. Permission Matrix

| Resource / Module | Read | Create | Update | Delete | API Endpoints |
|---|:---:|:---:|:---:|:---:|---|
| **Employees** | ✅ | ✅ | ✅ | ✅ | `GET /v1/employees`, `POST /v1/employees`, `PATCH /v1/employees/:id`, `DELETE /v1/employees/:id` |
| **Interns** | ✅ | ✅ | ✅ | ✅ | `GET /v1/interns`, `POST /v1/interns`, `PATCH /v1/interns/:id`, `DELETE /v1/interns/:id` |
| **Students (Course Enrollees)** | ✅ | ✅ | ✅ | ❌ | `GET /v1/students`, `POST /v1/students`, `PATCH /v1/students/:id` |
| **Recruitment & Career Applications** | ✅ | ✅ | ✅ | ✅ | `GET /v1/candidates`, `POST /v1/candidates/:id/convert-employee`, `POST /v1/candidates/:id/convert-intern` |
| **Website Inquiries (Routing)** | ✅ | ❌ | ✅ | ✅ | `GET /v1/contact-messages`, `POST /v1/contact-messages/:id/convert` |
| **Onboarding Plans & Checklists** | ✅ | ✅ | ✅ | ✅ | `GET /v1/onboarding-plans`, `POST /v1/onboarding-plans`, `GET /v1/onboardings` |
| **Attendance** | ✅ | ✅ | ✅ | ✅ | `GET /v1/attendance`, `POST /v1/attendance/checkin`, `PATCH /v1/attendance/:id` |
| **Leaves** | ✅ | ✅ | ✅ | ✅ | `GET /v1/leaves`, `POST /v1/leaves`, `PATCH /v1/leaves/:id/approve` |
| **Training (HR Pathways)** | ✅ | ✅ | ✅ | ❌ | `GET /v1/trainings`, `POST /v1/trainings`, `PATCH /v1/trainings/:id` |
| **Performance Reviews** | ✅ | ✅ | ✅ | ❌ | `GET /v1/performance`, `POST /v1/performance`, `PATCH /v1/performance/:id` |
| **HR Requests & Helpdesk** | ✅ | ✅ | ✅ | ❌ | `GET /v1/hr-requests`, `POST /v1/hr-requests`, `PATCH /v1/hr-requests/:id` |
| **HR Letters & Templates** | ✅ | ✅ | ✅ | ❌ | Live client-side variable generator + PDF export |
| **Documents Vault & Verification** | ✅ | ✅ | ✅ | ✅ | `GET /v1/documents`, `POST /v1/documents`, `DELETE /v1/documents/:id` |
| **Payroll (Compensation Master)** | ✅ | ✅ | ❌ | ❌ | `GET /v1/payroll/history`, `POST /v1/payroll/run` |
| **Exit & Offboarding (4-Tier)** | ✅ | ✅ | ✅ | ❌ | `GET /v1/exit-requests`, `POST /v1/exit-requests`, `PATCH /v1/exit-requests/:id` |
| **People Analytics Reports** | ✅ | ✅ | ❌ | ❌ | `GET /v1/reports`, CSV Export |
| **Announcements / Comms** | ✅ | ✅ | ✅ | ✅ | `GET /v1/communications`, `POST /v1/communications` |
| **Calendar & Holidays** | ✅ | ✅ | ✅ | ✅ | `GET /v1/calendar/events`, `GET /v1/holidays` |

---

## 3. Access Boundaries & Separation of Concerns

1. **HR vs LMS Separation**:
   - **HR Portal**: Responsible for assigning training pathways, pairing tutors/mentors, verifying tuition payments, monitoring milestone progress %, and issuing completion certificates.
   - **Tutor / LMS Portal**: Responsible for interactive course video player, lesson curriculum, code playgrounds, daily exercises, and live quizzes.
2. **HR vs Finance Separation**:
   - HR manages employee salary master structures, CTC parameters, and attendance multiplier records.
   - Core accounting ledger, P&L, balance sheets, and tax compliance remain restricted to the `FINANCE` role.
3. **HR vs Super Admin Separation**:
   - HR manages people, recruitment, and onboarding within their organization. Platform tenant provisioning and system-level configuration remain restricted to `SUPER_ADMIN`.

---

## 4. End-to-End User Flow
```text
Lead Inquiries / Career Candidates
  ↓
Admissions & Recruitment Conversion (/app/hr/students, /app/hr/applications)
  ↓
Internship Tracks & Employee 360° Profiles (/app/hr/interns, /app/hr/employees)
  ↓
Configurable Onboarding Checklists & Plans (/app/hr/onboarding-plans)
  ↓
Attendance & Training Monitoring (/app/hr/attendance, /app/hr/training)
  ↓
Milestone Performance Evaluations (/app/hr/performance)
  ↓
HR Operations, Letters & Requests (/app/hr/requests, /app/hr/letters)
  ↓
4-Tier Exit Clearance Hub (/app/hr/offboarding)
  ↓
People Analytics & SLA Reports (/app/hr/reports)
```

---

## 5. Security & Compliance
- Full audit logging on candidate conversions, student enrollments, document verifications, and exit clearances via `AuditLog.create()`.
- Real-time event broadcasting to active HR sockets for instant queue updates.