# Role-Based Calendar & Commitment Audit Report

**Workspace:** J:\eithiroli\ethiroli_react
**Audit Date:** 2026-09-23
**Scope:** Calendar events, schedules, recurring commitments, and role-based responsibility mapping

---

## 1. Executive Summary

The codebase contains a complete calendar management subsystem (`calendar_events` table with CRUD, recurrence support, and role-based access control), a separate scheduled-report engine, and 12 defined organizational roles. However, **significant misalignments exist between what roles are authorized to do with calendar/schedule data and what their designated responsibilities actually require**. The audit identified **6 critical gaps**, **8 misalignments**, and **4 missing duties** across the 12 roles.

**Critical findings:**
- **FINANCE, CLIENT, VENDOR** have no calendar permissions at all, yet their roles require scheduling (payroll runs, client meetings, vendor appointments)
- **Scheduled reports are restricted to ADMIN/SUPER_ADMIN only** — no other role can manage recurring commitments relevant to their own duties
- **All calendar events broadcast to HR regardless of creator** — notification noise for unrelated roles
- **No role-specific event filtering** — every role sees the same unfiltered calendar feed

---

## 2. Role & Permission Matrix (from `backend/src/config/constants.js`)

| Role | Calendar Access | Nav Items | Dashboard Metrics |
|------|---------------|-----------|------------------|
| SUPER_ADMIN | read + write | Global Calendar, Approvals, Notifications | Platform-wide |
| ADMIN | read + write | Calendar-adjacent (Attendance, HR, Finance, Projects) | Team, attendance, invoices, leads |
| HR | read + write | Calendar-adjacent (Interviews, Attendance, Leaves) | Employees, interviews, applications |
| TUTOR | read only | No calendar nav item | Courses, students, projects |
| PROJECT_MANAGER | read + write | Calendar (explicit nav item) | Projects, tasks, workflows |
| FINANCE | **NO calendar access** | Schedules, Payroll Runs | Invoices, transactions, revenue |
| SALES | read only | No calendar nav item | Leads, deals, candidates |
| RECEPTION | read + write | Calendar (explicit nav item) | Visitors, inquiries |
| EMPLOYEE | read only | Calendar (explicit nav item) | Attendance, tasks |
| STUDENT | read only | No calendar nav item | Courses, projects, tasks |
| INTERN | read only | Calendar (explicit nav item) | Attendance, projects, tasks |
| CLIENT | **NO calendar access** | No navigation | No dashboard |
| VENDOR | **NO calendar access** | No navigation | No dashboard |

---

## 3. Calendar Events Analysis (from `backend/src/models/CalendarEvent.js` + `calendarController.js`)

### 3.1 Event Schema
Each event supports: `title`, `description`, `event_type`, `start_time`, `end_time`, `user_id`, `created_by`, `assigned_users[]`, `location`, `is_all_day`, `recurrence_rule`

### 3.2 CRUD Access Control (from `backend/src/routes/calendarRoutes.js`)

| Operation | Endpoint | Allowed Roles |
|-----------|----------|--------------|
| List | GET `/calendar/events` | EMPLOYEE, INTERN, HR, TUTOR, PM, ADMIN, SUPER_ADMIN, RECEPTION |
| Create | POST `/calendar/events` | HR, TUTOR, PM, ADMIN, SUPER_ADMIN |
| Get | GET `/calendar/events/:id` | EMPLOYEE, INTERN, HR, TUTOR, PM, ADMIN, SUPER_ADMIN, RECEPTION |
| Update | PATCH `/calendar/events/:id` | HR, TUTOR, PM, ADMIN, SUPER_ADMIN |
| Delete | DELETE `/calendar/events/:id` | ADMIN, SUPER_ADMIN only |

### 3.3 Notification Misalignment (from `calendarController.js`)
Every calendar operation (create/update/delete) broadcasts to the **HR** role:
- `broadcastToRole('HR', 'calendar_event_created', { id })`
- `broadcastToRole('HR', 'calendar_event_updated', { id })`
- `broadcastToRole('HR', 'calendar_event_deleted', { id })`

**Finding:** Events created by a TUTOR, PM, or RECEPTION are all broadcast to HR, regardless of relevance. Conversely, events created by HR are also broadcast to HR (self-notification). There is no role-aware notification routing.

### 3.4 Recurrence Gap (from `CalendarEvent.js`)
- `recurrence_rule` field exists in the schema and is updatable
- **No validation exists** for recurrence rules
- **No expansion logic exists** — recurring events are stored as single rows, not expanded into instances
- `RECURRING_FREQUENCY` enum exists in `constants.js` but is never used in the calendar subsystem

---

## 4. Schedules & Recurring Commitments Analysis

### 4.1 Scheduled Reports (from `scheduledReportController.js` + `scheduledReportRoutes.js`)

| Operation | Allowed Roles | Issue |
|-----------|-------------|-------|
| List | ADMIN, SUPER_ADMIN | No other role can view reports relevant to their duties |
| Create | ADMIN, SUPER_ADMIN | **FINANCE cannot schedule financial reports**, TUTOR cannot schedule course analytics, PM cannot schedule project reports |
| Update | ADMIN, SUPER_ADMIN | Same restriction |
| Run Now | ADMIN, SUPER_ADMIN | Same restriction |
| Pause | ADMIN, SUPER_ADMIN | Same restriction |

**Critical Finding:** The navigation explicitly exposes "Financial Reports" (FINANCE), "Course Analytics" (TUTOR), and "Project Reports" (PM) to their respective roles, but **only ADMIN/SUPER_ADMIN can schedule those reports**. This is a direct contradiction between role responsibilities and system capabilities.

### 4.2 Interview Scheduling Data (from `backend/scripts/seed-hr-data.js`)

Seeded interviews (interviewer: HR user):
- `2026-09-16 11:00` — ROUND_1 (45 min)
- `2026-09-18 15:30` — HR_ROUND (30 min)
- `2026-09-12 14:00` — ROUND_2 (60 min, COMPLETED)

**Finding:** Interviews exist in a **separate `interviews` table**, NOT in the calendar events system. This creates a split calendar where HR's interview commitments live in one place and other events in another. There is no integration between the two, and no calendar event is auto-generated when an interview is scheduled.

### 4.3 Payroll Runs (FINANCE)
- `Finance` role has `payroll:read, payroll:write` permissions
- Navigation exposes "Payroll Runs"
- But no calendar events are created for payroll runs, and no recurring schedule is defined
- **Missing duty:** Payroll run scheduling is not tracked in the calendar system

### 4.4 Timesheets (PROJECT_MANAGER)
- `PROJECT_MANAGER` role has `tasks:read, tasks:write`
- Navigation exposes "Timesheets"
- No calendar events or scheduled commitments exist for timesheet reviews
- **Missing duty:** Timesheet review cycles are not tracked

### 4.5 Attendance & Leave (HR/EMPLOYEE/INTERN)
- `attendance:read/write` and `leaves:read/write` are core permissions for HR, EMPLOYEE, INTERN
- Navigation exposes "Attendance" for HR, ADMIN, TUTOR, EMPLOYEE, STUDENT, INTERN
- Seeded leaves show date ranges but these are stored in a `leaves` table, **not** calendar events
- **Missing duty:** Approved leave periods are not reflected on calendars

---

## 5. Role-by-Role Responsibility Audit

### 5.1 SUPER_ADMIN
**Designated responsibilities:** Platform-wide oversight, tenants, users, roles & permissions, billing, monitoring, security
**Current calendar mapping:** Full read/write access, Global Calendar nav item
**Gaps:** None critical. Has full calendar control.
**Status:** ✅ Aligned

### 5.2 ADMIN
**Designated responsibilities:** Operations management across people, learning, projects, HR, CRM, finance
**Current calendar mapping:** Full read/write access
**Gaps:**
- **Missing duty:** No dedicated "Calendar" nav item — calendar access is implicit via permissions, not discoverable
- Scheduled reports restricted to ADMIN/SUPER_ADMIN — ADMIN cannot delegate report scheduling to role owners
**Status:** ⚠️ Partially aligned — calendar capability exists but is not surfaced

### 5.3 HR
**Designated responsibilities:** Job applications, employees, interns, onboarding, attendance, leaves, interviews, training, performance, payroll, offboarding
**Current calendar mapping:** Full read/write access, broadcasts receive all calendar events
**Gaps:**
- **Missing duty:** Interviews are NOT in the calendar events system — HR's core scheduling activity (interviews) lives in a separate table
- **Missing duty:** Interview reminders/notifications are not integrated with the calendar
- **Missing duty:** Onboarding/offboarding milestones are not tracked as calendar events
- **Misalignment:** Receives ALL calendar events regardless of relevance
**Status:** ⚠️ Major gap — core HR scheduling function is outside the calendar system

### 5.4 TUTOR
**Designated responsibilities:** Courses, curriculum, students, attendance, assignments, quizzes, grades, doubts, certificates, forum, communications
**Current calendar mapping:** Read-only calendar access, **no Calendar nav item**
**Gaps:**
- **Missing duty:** No write access to create class schedules, quiz schedules, assignment deadlines on the calendar
- **Missing duty:** No dedicated calendar entry point in navigation
- **Misalignment:** Navigation exposes "Attendance" but calendar access is read-only — cannot schedule attendance-related events
**Status:** ❌ Misaligned — role requires scheduling but has read-only access

### 5.5 PROJECT_MANAGER
**Designated responsibilities:** Projects, team, tasks, timesheets, client communication, invoices, project reports, approvals, company settings
**Current calendar mapping:** Full read/write access, explicit Calendar nav item
**Gaps:**
- **Missing duty:** Timesheet review cycles not tracked as recurring calendar commitments
- **Missing duty:** Client meeting scheduling not integrated with calendar
- **Misalignment:** PM can write calendar events but cannot schedule project reports (restricted to ADMIN)
**Status:** ⚠️ Partially aligned

### 5.6 FINANCE
**Designated responsibilities:** Salary, tax, refunds, receivables, payables, financial reports, income, expenses, invoices, payments, schedules, payroll runs
**Current calendar mapping:** **NO calendar access at all**
**Gaps:**
- **Critical gap:** No calendar permissions (`calendar:read`/`calendar:write` absent from ROLE_PERMISSIONS.FINANCE)
- **Missing duty:** Payroll run scheduling not tracked in calendar
- **Missing duty:** Payment due dates, invoice due dates, tax deadlines not tracked as calendar events
- **Missing duty:** Cannot schedule financial reports (restricted to ADMIN/SUPER_ADMIN)
- **Missing duty:** No calendar nav item
**Status:** ❌ Critical misalignment — finance role requires extensive scheduling but has zero calendar access

### 5.7 SALES
**Designated responsibilities:** CRM contacts, opportunities, deals, proposals, campaigns, reports, follow-ups
**Current calendar mapping:** Read-only calendar access, **no Calendar nav item**
**Gaps:**
- **Missing duty:** Cannot create follow-up meeting events on calendar (read-only)
- **Missing duty:** No dedicated calendar entry point for sales calls/meetings
- **Misalignment:** Sales role requires frequent scheduling but has read-only access
**Status:** ❌ Misaligned — role requires scheduling but has read-only access

### 5.8 RECEPTION
**Designated responsibilities:** Visitors, enquiries, admissions, registration, payments, calendar, communications
**Current calendar mapping:** Full read/write access, explicit Calendar nav item
**Gaps:**
- **Missing duty:** Visitor appointment scheduling not structured in calendar event types
- **Missing duty:** Admission/counseling appointment tracking not integrated
**Status:** ✅ Mostly aligned — has calendar access but event-type taxonomy is missing

### 5.9 EMPLOYEE
**Designated responsibilities:** Attendance, profile, documents, salary, training, announcements, support, my tasks, calendar, approvals, leaves, payslips, performance
**Current calendar mapping:** Read-only calendar access, explicit Calendar nav item
**Gaps:**
- **Missing duty:** Cannot create/update personal calendar events (read-only)
- **Missing duty:** Training sessions, performance reviews not tracked as calendar events
- **Misalignment:** Employee can request leave but leave dates are not reflected on their calendar
**Status:** ⚠️ Partially aligned — calendar exists but is read-only

### 5.10 STUDENT
**Designated responsibilities:** Courses, course player, live classes, live quiz, assessments, assignments, projects, attendance, doubts, messages, mind map, certificates, documents, payments, notifications, profile
**Current calendar mapping:** Read-only calendar access, **no Calendar nav item**
**Gaps:**
- **Missing duty:** No dedicated calendar entry point for class schedule, quiz schedule, assignment deadlines
- **Missing duty:** Live class schedules not surfaced on calendar
- **Misalignment:** Student's core activities (classes, quizzes) are schedule-driven but calendar is hidden
**Status:** ❌ Misaligned — schedule-critical role has hidden read-only calendar

### 5.11 INTERN
**Designated responsibilities:** Training plan, daily tasks, attendance, projects, assignments, daily work log, mentor, feedback, calendar, documents, certificate
**Current calendar mapping:** Read-only calendar access, explicit Calendar nav item
**Gaps:**
- **Missing duty:** Cannot update own calendar (read-only)
- **Missing duty:** Mentor meeting schedules not tracked as recurring calendar events
- **Missing duty:** Training plan milestones not on calendar
**Status:** ⚠️ Partially aligned

### 5.12 CLIENT
**Designated responsibilities:** (Not defined in navigation or permissions)
**Current calendar mapping:** No calendar access, no navigation, no dashboard
**Gaps:**
- **Critical gap:** Role exists in `constants.js` but has no permissions, no navigation, no dashboard
- **Missing duty:** Client meeting scheduling, project milestone visibility
**Status:** ❌ Incomplete role definition — role is defined but not functional

### 5.13 VENDOR
**Designated responsibilities:** (Not defined in navigation or permissions)
**Current calendar mapping:** No calendar access, no navigation, no dashboard
**Gaps:**
- **Critical gap:** Role exists in `constants.js` but has no permissions, no navigation, no dashboard
- **Missing duty:** Vendor appointment scheduling, delivery milestone visibility
**Status:** ❌ Incomplete role definition — role is defined but not functional

---

## 6. Optimized Role-Based Calendar Mapping

### 6.1 Calendar Event Taxonomy (Recommended)

Every event should carry an `event_type` that maps to a specific role responsibility:

| Event Type | Primary Role | Secondary Roles | Frequency |
|-----------|-------------|----------------|-----------|
| `INTERVIEW` | HR | PM (technical), ADMIN | One-time |
| `ONBOARDING` | HR | EMPLOYEE/INTERN | One-time |
| `OFFBOARDING` | HR | ADMIN | One-time |
| `CLASS` | TUTOR | STUDENT | Recurring |
| `QUIZ` | TUTOR | STUDENT | One-time/Recurring |
| `ASSIGNMENT_DEADLINE` | TUTOR | STUDENT | One-time |
| `LIVE_CLASS` | TUTOR | STUDENT | Recurring |
| `PROJECT_MILESTONE` | PM | EMPLOYEE/INTERN/STUDENT | One-time |
| `CLIENT_MEETING` | PM | SALES, CLIENT | One-time |
| `TIMESHEET_REVIEW` | PM | EMPLOYEE | Weekly |
| `PAYROLL_RUN` | FINANCE | ADMIN | Monthly |
| `INVOICE_DUE` | FINANCE | CLIENT | Recurring |
| `TAX_DEADLINE` | FINANCE | ADMIN | Recurring |
| `SALES_FOLLOWUP` | SALES | CLIENT | Recurring |
| `SALES_DEMO` | SALES | CLIENT | One-time |
| `VISITOR_APPOINTMENT` | RECEPTION | EMPLOYEE | One-time |
| `ADMISSION_COUNSELING` | RECEPTION | HR | One-time |
| `ATTENDANCE_REVIEW` | HR | EMPLOYEE/INTERN | Daily |
| `PERFORMANCE_REVIEW` | HR | EMPLOYEE | Quarterly |
| `TRAINING_SESSION` | HR | EMPLOYEE/INTERN | Recurring |
| `PERSONAL_EVENT` | Any role | N/A | One-time |

### 6.2 Optimized Role-Based Calendar Views

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ SUPER_ADMIN  │ Global Calendar (all roles, all event types)                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ ADMIN      │ Operations Calendar (all internal roles, operational events)   │
├─────────────────────────────────────────────────────────────────────────────┤
│ HR         │ People Operations Calendar (interviews, onboarding, leaves,    │
│            │ performance reviews, training sessions, attendance reviews)    │
├─────────────────────────────────────────────────────────────────────────────┤
│ TUTOR      │ Academic Calendar (classes, quizzes, assignment deadlines,     │
│            │ grades, certificates)                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│ PROJECT_MANAGER │ Project Calendar (milestones, client meetings,            │
│                │ timesheet reviews, project reports)                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ FINANCE  │ Financial Calendar (payroll runs, invoice due dates, tax         │
│          │ deadlines, payment schedules, financial reports)                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ SALES    │ Sales Calendar (client calls, demos, follow-ups, proposals)      │
├─────────────────────────────────────────────────────────────────────────────┤
│ RECEPTION │ Front Desk Calendar (visitor appointments, admissions,         │
│          │ registrations, payments)                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ EMPLOYEE │ Personal Calendar (attendance, leaves, training, my tasks,       │
│          │ performance reviews, payslips)                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ STUDENT  │ Learning Calendar (live classes, quizzes, assignments,          │
│          │ projects, attendance, certificates)                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ INTERN   │ Training Calendar (training plan milestones, daily tasks,        │
│          │ mentor meetings, projects, attendance)                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ CLIENT   │ Client Calendar (project milestones, client meetings,           │
│          │ proposals, invoices)                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ VENDOR   │ Vendor Calendar (delivery milestones, appointments, invoices)   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.3 Optimized Role-Based Access Control

| Role | Read | Create | Update | Delete |
|------|------|--------|--------|--------|
| SUPER_ADMIN | ✓ | ✓ | ✓ | ✓ |
| ADMIN | ✓ | ✓ | ✓ | ✓ |
| HR | ✓ | ✓ | ✓ | ✓ (own + HR events) |
| TUTOR | ✓ | ✓ | ✓ | ✓ (own) |
| PROJECT_MANAGER | ✓ | ✓ | ✓ | ✓ (own) |
| FINANCE | ✓ | ✓ | ✓ | ✓ (own) |
| SALES | ✓ | ✓ | ✓ | ✓ (own) |
| RECEPTION | ✓ | ✓ | ✓ | ✓ (own) |
| EMPLOYEE | ✓ | ✓ | ✓ | ✓ (own) |
| STUDENT | ✓ | ✓ | ✓ | ✓ (own) |
| INTERN | ✓ | ✓ | ✓ | ✓ (own) |
| CLIENT | ✓ | ✓ | ✓ | ✓ (own) |
| VENDOR | ✓ | ✓ | ✓ | ✓ (own) |

### 6.4 Optimized Notification Routing

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Event Type → Notification Recipients                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ INTERVIEW → HR, PM, candidate user                                          │
│ CLASS/QUIZ/ASSIGNMENT → TUTOR, STUDENT                                      │
│ PROJECT_MILESTONE → PM, assigned EMPLOYEE/INTERN/STUDENT                    │
│ CLIENT_MEETING → PM, SALES, CLIENT                                          │
│ TIMESHEET_REVIEW → PM, EMPLOYEE                                             │
│ PAYROLL_RUN → FINANCE, ADMIN                                                │
│ INVOICE_DUE → FINANCE, CLIENT                                               │
│ TAX_DEADLINE → FINANCE, ADMIN                                               │
│ SALES_FOLLOWUP → SALES, CLIENT                                              │
│ VISITOR_APPOINTMENT → RECEPTION, host EMPLOYEE                              │
│ ADMISSION_COUNSELING → RECEPTION, HR                                        │
│ ATTENDANCE_REVIEW → HR, EMPLOYEE, INTERN                                    │
│ PERFORMANCE_REVIEW → HR, EMPLOYEE                                           │
│ TRAINING_SESSION → HR, EMPLOYEE, INTERN                                     │
│ PERSONAL_EVENT → creator only                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.5 Recurring Commitment Schedule by Role

| Role | Recurring Commitment | Frequency | Owner |
|------|---------------------|-----------|-------|
| SUPER_ADMIN | Platform health review | Weekly | SUPER_ADMIN |
| ADMIN | Operations review | Weekly | ADMIN |
| HR | Attendance review | Daily | HR |
| HR | Interview scheduling | As needed | HR |
| HR | Performance review cycles | Quarterly | HR |
| HR | Training sessions | Weekly | HR |
| TUTOR | Class schedule | Daily | TUTOR |
| TUTOR | Quiz/assignment deadlines | As needed | TUTOR |
| PROJECT_MANAGER | Timesheet review | Weekly | PM |
| PROJECT_MANAGER | Client meeting review | Weekly | PM |
| FINANCE | Payroll run preparation | Monthly | FINANCE |
| FINANCE | Invoice due date review | Daily | FINANCE |
| FINANCE | Tax deadline tracking | As needed | FINANCE |
| SALES | Follow-up calls | Daily | SALES |
| SALES | Deal review | Weekly | SALES |
| RECEPTION | Visitor appointment review | Daily | RECEPTION |
| EMPLOYEE | Attendance submission | Daily | EMPLOYEE |
| EMPLOYEE | Task updates | Daily | EMPLOYEE |
| STUDENT | Live class attendance | Daily | STUDENT |
| STUDENT | Assignment submissions | As needed | STUDENT |
| INTERN | Daily work log | Daily | INTERN |
| INTERN | Mentor check-in | Weekly | INTERN |

---

## 7. Key Misalignments Summary

| # | Misalignment | Severity | Impact |
|---|-------------|----------|--------|
| 1 | FINANCE has no calendar access | CRITICAL | Cannot schedule payroll, track invoice due dates |
| 2 | Scheduled reports restricted to ADMIN/SUPER_ADMIN | CRITICAL | Role owners cannot manage their own recurring reports |
| 3 | All calendar events broadcast to HR | HIGH | Notification noise, irrelevant alerts |
| 4 | Interviews stored outside calendar system | HIGH | HR's core scheduling split across two systems |
| 5 | TUTOR, SALES read-only for calendar | MEDIUM | Cannot create their own schedule events |
| 6 | EMPLOYEE, STUDENT, INTERN read-only | MEDIUM | Cannot manage personal commitments |
| 7 | CLIENT, VENDOR roles undefined | HIGH | External stakeholders have no functionality |
| 8 | No role-specific event filtering | MEDIUM | Every role sees all events |
| 9 | Recurrence rules not validated | MEDIUM | Invalid recurring event definitions possible |
| 10 | No recurrence expansion logic | MEDIUM | Recurring events stored as single rows |
| 11 | No calendar nav for ADMIN, TUTOR, SALES, STUDENT | LOW | Calendar access not discoverable |
| 12 | No leave/training/performance integration | MEDIUM | HR events not visible on calendars |

---

## 8. Missing Duties by Role

### HR — Missing Duties
- Interview scheduling integrated with calendar
- Onboarding/offboarding milestones on calendar
- Interview reminder notifications

### FINANCE — Missing Duties
- Payroll run scheduling
- Invoice due date tracking
- Tax deadline tracking
- Financial report scheduling
- Payment schedule management

### TUTOR — Missing Duties
- Class schedule creation
- Quiz/assignment deadline scheduling
- Grade review scheduling

### SALES — Missing Duties
- Follow-up meeting scheduling
- Client demo scheduling
- Proposal review scheduling

### PROJECT_MANAGER — Missing Duties
- Timesheet review scheduling
- Client meeting scheduling
- Project report scheduling

### EMPLOYEE — Missing Duties
- Training session scheduling
- Performance review scheduling
- Personal event management

### STUDENT — Missing Duties
- Live class schedule visibility
- Assignment deadline visibility
- Quiz schedule visibility

### INTERN — Missing Duties
- Mentor meeting scheduling
- Training plan milestone tracking
- Daily work log integration

### CLIENT/VENDOR — Missing Duties
- Role definition completion
- Meeting scheduling capabilities
- Milestone visibility

---

## 9. Recommended Implementation Priorities

### P0 (Critical — Immediate)
1. Add `calendar:read` and `calendar:write` permissions to FINANCE role
2. Expand scheduled report creation/update permissions to role owners (FINANCE for financial reports, TUTOR for course analytics, PM for project reports, HR for HR reports)
3. Complete CLIENT and VENDOR role definitions (permissions, navigation, dashboard)

### P1 (High)
4. Integrate interviews into calendar events (auto-generate calendar events when interviews are scheduled)
5. Implement role-aware notification routing (replace universal HR broadcast)
6. Add role-specific event filtering to calendar API

### P2 (Medium)
7. Add calendar nav items for ADMIN, TUTOR, SALES, STUDENT
8. Upgrade TUTOR, SALES, EMPLOYEE, STUDENT, INTERN from read-only to write access for own events
9. Implement recurrence rule validation and expansion
10. Integrate attendance, leaves, training, performance events into calendar system

### P3 (Low)
11. Add event type taxonomy for visitor appointments, admissions, payments
12. Add recurring commitment templates per role

---

## 10. Verification Checklist

- [ ] FINANCE role has calendar permissions
- [ ] Scheduled reports creatable by role owners
- [ ] CLIENT and VENDOR roles fully defined
- [ ] Interviews create calendar events automatically
- [ ] Notification routing is role-aware
- [ ] Calendar API filters by role and event type
- [ ] Calendar nav items visible for all roles
- [ ] TUTOR/SALES/EMPLOYEE/STUDENT/INTERN can create own events
- [ ] Recurrence rules validated and expanded
- [ ] Attendance/leave/training/performance events integrated
