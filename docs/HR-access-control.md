# HR Access Control

## 1. Role Title and Summary
- **Role**: HR  
- **Purpose**: Manages employee lifecycle, attendance, leave, training, and related HR operations. Provides full CRUD for HR‑specific resources and read/write for select modules such as calendar, performance, and approvals.  
- **Portal Slug**: `hr`  
- **MFA Required**: No  
- **Session Duration**: 8 hours  
- **Cookie Path**: `/app/hr`

## 2. Permission Matrix
| Resource / Module | Read | Create | Update | Delete | API Endpoints |
|-------------------|------|--------|--------|--------|----------------|
| Employees | ✅ | ✅ | ✅ | ✅ | `GET /v1/employees`, `POST /v1/employees`, `PATCH /v1/employees/:id`, `DELETE /v1/employees/:id` |
| Interns | ✅ | ✅ | ✅ | ✅ | `GET /v1/interns`, `POST /v1/interns`, `PATCH /v1/interns/:id`, `DELETE /v1/interns/:id` |
| Attendance | ✅ | ✅ | ✅ | ✅ | `GET /v1/attendance`, `POST /v1/attendance`, `PATCH /v1/attendance/:id`, `DELETE /v1/attendance/:id` |
| Leaves | ✅ | ✅ | ✅ | ✅ | `GET /v1/leaves`, `POST /v1/leaves`, `PATCH /v1/leaves/:id`, `DELETE /v1/leaves/:id` |
| Courses | ✅ | ✅ | ✅ | ✅ | `GET /v1/courses`, `POST /v1/courses`, `PATCH /v1/courses/:id`, `DELETE /v1/courses/:id` |
| Modules | ✅ | ✅ | ✅ | ✅ | `GET /v1/modules`, `POST /v1/modules`, `PATCH /v1/modules/:id`, `DELETE /v1/modules/:id` |
| Lessons | ✅ | ✅ | ✅ | ✅ | `GET /v1/lessons`, `POST /v1/lessons`, `PATCH /v1/lessons/:id`, `DELETE /v1/lessons/:id` |
| Enrollments | ✅ | ✅ | ✅ | ✅ | `GET /v1/enrollments`, `POST /v1/enrollments`, `PATCH /v1/enrollments/:id`, `DELETE /v1/enrollments/:id` |
| Quizzes | ✅ | ✅ | ✅ | ✅ | `GET /v1/quizzes`, `POST /v1/quizzes`, `PATCH /v1/quizzes/:id`, `DELETE /v1/quizzes/:id` |
| Assignments | ✅ | ✅ | ✅ | ✅ | `GET /v1/assignments`, `POST /v1/assignments`, `PATCH /v1/assignments/:id`, `DELETE /v1/assignments/:id` |
| Interviews | ✅ | ✅ | ✅ | ✅ | `GET /v1/interviews`, `POST /v1/interviews`, `PATCH /v1/interviews/:id`, `DELETE /v1/interviews/:id` |
| Payroll | ✅ | ❌ | ❌ | ❌ | `GET /v1/payroll` |
| Performance | ✅ | ✅ | ✅ | ❌ | `GET /v1/performance`, `POST /v1/performance`, `PATCH /v1/performance/:id` |
| Calendar | ✅ | ✅ | ✅ | ✅ | `GET /v1/calendar`, `POST /v1/calendar`, `PATCH /v1/calendar/:id`, `DELETE /v1/calendar/:id` |
| Holidays | ✅ | ✅ | ✅ | ✅ | `GET /v1/holidays`, `POST /v1/holidays`, `PATCH /v1/holidays/:id`, `DELETE /v1/holidays/:id` |
| Approvals | ✅ | ✅ | ✅ | ✅ | `GET /v1/approvals`, `POST /v1/approvals`, `PATCH /v1/approvals/:id`, `DELETE /v1/approvals/:id` |
| Clients | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Subscriptions | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Tasks | ❌ | ❌ | ❌ | ❌ | *No permissions* |
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
| Payslips | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Auth & Users | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Roles | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| System Settings | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Audit Logs | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Health Checks | ❌ | ❌ | ❌ | ❌ | `GET /health` |
| Monitoring | ❌ | ❌ | ❌ | ❌ | *No permissions* |

## 3. Access Boundaries
- No access to financial or invoicing modules.
- Cannot manage user roles or system configurations.
- HR actions are limited to employee and intern data; cannot view payroll details.
- No access to client‑facing modules (clients, subscriptions, leads).

## 4. User Flow & Typical Actions
- Process employee attendance and leave submissions.
- Create and update course enrollments, lessons, and assessments.
- Manage holiday calendars and departmental events.
- Generate performance reports and audit trails for HR analytics.
- Approve or reject leave requests and attendance corrections.

## 5. Compliance & Security Considerations
- HR data is sensitive; access logged and reviewed.
- All HR actions require justification; escalation for deletions.
- MFA optional but recommended.
- Data retention aligns with labor regulations; automatic purging of terminated employee records after 6 months.

Generated from `backend/src/config/constants.js` `ROLE_PERMISSIONS` and `backend/src/routes/index.js`.