# EMPLOYEE Access Control

## 1. Role Title and Summary
- **Role**: Employee  
- **Purpose**: Manages personal employee data: attendance, leave, tasks, performance reviews, and approvals. Provides full CRUD for attendance and leave, read/write for tasks, performance, calendar, and approvals; read for payslips.  
- **Portal Slug**: `employee`  
- **MFA Required**: No  
- **Session Duration**: 8 hours  
- **Cookie Path**: `/app/employee`

## 2. Permission Matrix
| Resource / Module | Read | Create | Update | Delete | API Endpoints |
|-------------------|------|--------|--------|--------|----------------|
| Employees | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Interns | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Attendance | ✅ | ✅ | ✅ | ✅ | `GET /v1/attendance`, `POST /v1/attendance`, `PATCH /v1/attendance/:id`, `DELETE /v1/attendance/:id` |
| Leaves | ✅ | ✅ | ✅ | ✅ | `GET /v1/leaves`, `POST /v1/leaves`, `PATCH /v1/leaves/:id`, `DELETE /v1/leaves/:id` |
| Courses | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Modules | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Lessons | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Enrollments | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Quizzes | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Assignments | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Interviews | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Payroll | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Performance | ✅ | ❌ | ❌ | ❌ | `GET /v1/performance` |
| Calendar | ✅ | ✅ | ✅ | ✅ | `GET /v1/calendar`, `POST /v1/calendar`, `PATCH /v1/calendar/:id`, `DELETE /v1/calendar/:id` |
| Holidays | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Approvals | ✅ | ❌ | ❌ | ❌ | `GET /v1/approvals` |
| Clients | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Subscriptions | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Tasks | ✅ | ❌ | ❌ | ❌ | `GET /v1/tasks` |
| Invoices | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Company Settings | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Leads | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Payments | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Transactions | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Reports | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Communications | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Forums | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Badges | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Certificates | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Projects | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Mind Maps | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Payslips | ✅ | ❌ | ❌ | ❌ | `GET /v1/payslips` |
| Auth & Users | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Roles | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| System Settings | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Audit Logs | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Health Checks | ❌ | ❌ | ❌ | ❌ | `GET /health` |
| Monitoring | ❌ | ❌ | ❌ | ❌ | *No permissions* |

## 3. Access Boundaries
- No access to financial modules (payroll, payments, invoices).
- Cannot manage other employees or system configurations.
- Limited to personal data; cannot view HR‑wide reports.
- No administrative rights.

## 4. User Flow & Typical Actions
- Submit and track attendance and leave requests.
- View personal tasks and performance feedback.
- Schedule meetings and events via calendar.
- Review and respond to approval requests (e.g., leave approvals).
- Access payslips and personal documents.

## 5. Compliance & Security Considerations
- Employee data is confidential; access logged and reviewed.
- MFA optional but recommended for account security.
- Data retention per employment policies; automatic purging after off‑boarding.
- All employee actions are audited; escalation path for disputes documented.

Generated from `backend/src/config/constants.js` `ROLE_PERMISSIONS` and `backend/src/routes/index.js`.
