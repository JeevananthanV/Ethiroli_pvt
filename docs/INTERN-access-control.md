# INTERN Access Control

## 1. Role Title and Summary
- **Role**: Intern  
- **Purpose**: Manages attendance, leave, tasks, and project involvement. Provides full CRUD for attendance and leave, read/write for tasks and projects, and calendar integration.  
- **Portal Slug**: intern  
- **MFA Required**: No  
- **Session Duration**: 24 hours  
- **Cookie Path**: /app/intern

## 2. Permission Matrix
| Resource / Module | Read | Create | Update | Delete | API Endpoints |
|-------------------|------|--------|--------|--------|----------------|
| Employees | ? | ? | ? | ? | *No permissions* |
| Interns | ? | ? | ? | ? | *No permissions* |
| Attendance | ? | ? | ? | ? | GET /v1/attendance, POST /v1/attendance, PATCH /v1/attendance/:id, DELETE /v1/attendance/:id |
| Leaves | ? | ? | ? | ? | GET /v1/leaves, POST /v1/leaves, PATCH /v1/leaves/:id, DELETE /v1/leaves/:id |
| Courses | ? | ? | ? | ? | *No permissions* |
| Modules | ? | ? | ? | ? | *No permissions* |
| Lessons | ? | ? | ? | ? | *No permissions* |
| Enrollments | ? | ? | ? | ? | *No permissions* |
| Quizzes | ? | ? | ? | ? | *No permissions* |
| Assignments | ? | ? | ? | ? | *No permissions* |
| Interviews | ? | ? | ? | ? | *No permissions* |
| Payroll | ? | ? | ? | ? | *No permissions* |
| Performance | ? | ? | ? | ? | *No permissions* |
| Calendar | ? | ? | ? | ? | GET /v1/calendar, POST /v1/calendar, PATCH /v1/calendar/:id, DELETE /v1/calendar/:id |
| Holidays | ? | ? | ? | ? | *No permissions* |
| Approvals | ? | ? | ? | ? | *No permissions* |
| Clients | ? | ? | ? | ? | *No permissions* |
| Subscriptions | ? | ? | ? | ? | *No permissions* |
| Tasks | ? | ? | ? | ? | GET /v1/tasks, POST /v1/tasks, PATCH /v1/tasks/:id, DELETE /v1/tasks/:id |
| Invoices | ? | ? | ? | ? | *No permissions* |
| Company Settings | ? | ? | ? | ? | *No permissions* |
| Leads | ? | ? | ? | ? | *No permissions* |
| Payments | ? | ? | ? | ? | *No permissions* |
| Transactions | ? | ? | ? | ? | *No permissions* |
| Reports | ? | ? | ? | ? | *No permissions* |
| Communications | ? | ? | ? | ? | *No permissions* |
| Forums | ? | ? | ? | ? | *No permissions* |
| Badges | ? | ? | ? | ? | *No permissions* |
| Certificates | ? | ? | ? | ? | *No permissions* |
| Projects | ? | ? | ? | ? | GET /v1/projects, POST /v1/projects, PATCH /v1/projects/:id, DELETE /v1/projects/:id |
| Mind Maps | ? | ? | ? | ? | *No permissions* |
| Payslips | ? | ? | ? | ? | *No permissions* |
| Auth & Users | ? | ? | ? | ? | *No permissions* |
| Roles | ? | ? | ? | ? | *No permissions* |
| System Settings | ? | ? | ? | ? | *No permissions* |
| Audit Logs | ? | ? | ? | ? | *No permissions* |
| Health Checks | ? | ? | ? | ? | GET /health |
| Monitoring | ? | ? | ? | ? | *No permissions* |

## 3. Access Boundaries
- No access to financial or HR modules.
- Limited to own attendance, leave, tasks, and assigned projects.
- No system administration rights.
- Cannot view employee or payroll data.

## 4. User Flow & Typical Actions
- Record attendance and submit leave requests.
- Update and manage assigned tasks.
- Contribute to assigned projects and mind maps.
- Schedule events via calendar.

## 5. Compliance & Security Considerations
- Intern data is sensitive; access logged and reviewed.
- MFA optional but recommended for account security.
- Data retention per internship policies; automatic purging after internship end.
- All intern actions are audited; escalation path for issues documented.

Generated from ackend/src/config/constants.js ROLE_PERMISSIONS and ackend/src/routes/index.js.