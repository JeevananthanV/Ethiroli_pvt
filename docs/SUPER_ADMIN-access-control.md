# SUPER_ADMIN Access Control

## 1. Role Title and Summary
- **Role**: Super Admin  
- **Purpose**: Highest-level administrative role with unrestricted access to all system resources, configurations, and tenant operations. Super Admins can manage users, roles, permissions, system settings, and all other administrative functions.  
- **Portal Slug**: super-admin  
- **MFA Required**: Yes  
- **Session Duration**: 4 hours  
- **Cookie Path**: /app/super-admin

## 2. Permission Matrix
| Resource / Module | Read | Create | Update | Delete | API Endpoints |
|-------------------|------|--------|--------|--------|----------------|
| Employees | ✅ | ✅ | ✅ | ✅ | GET /v1/employees, POST /v1/employees, PATCH /v1/employees/:id, DELETE /v1/employees/:id |
| Interns | ✅ | ✅ | ✅ | ✅ | GET /v1/interns, POST /v1/interns, PATCH /v1/interns/:id, DELETE /v1/interns/:id |
| Attendance | ✅ | ✅ | ✅ | ✅ | GET /v1/attendance, POST /v1/attendance, PATCH /v1/attendance/:id, DELETE /v1/attendance/:id |
| Leaves | ✅ | ✅ | ✅ | ✅ | GET /v1/leaves, POST /v1/leaves, PATCH /v1/leaves/:id, DELETE /v1/leaves/:id |
| Courses | ✅ | ✅ | ✅ | ✅ | GET /v1/courses, POST /v1/courses, PATCH /v1/courses/:id, DELETE /v1/courses/:id |
| Modules | ✅ | ✅ | ✅ | ✅ | GET /v1/modules, POST /v1/modules, PATCH /v1/modules/:id, DELETE /v1/modules/:id |
| Lessons | ✅ | ✅ | ✅ | ✅ | GET /v1/lessons, POST /v1/lessons, PATCH /v1/lessons/:id, DELETE /v1/lessons/:id |
| Enrollments | ✅ | ✅ | ✅ | ✅ | GET /v1/enrollments, POST /v1/enrollments, PATCH /v1/enrollments/:id, DELETE /v1/enrollments/:id |
| Quizzes | ✅ | ✅ | ✅ | ✅ | GET /v1/quizzes, POST /v1/quizzes, PATCH /v1/quizzes/:id, DELETE /v1/quizzes/:id |
| Assignments | ✅ | ✅ | ✅ | ✅ | GET /v1/assignments, POST /v1/assignments, PATCH /v1/assignments/:id, DELETE /v1/assignments/:id |
| Interviews | ✅ | ✅ | ✅ | ✅ | GET /v1/interviews, POST /v1/interviews, PATCH /v1/interviews/:id, DELETE /v1/interviews/:id |
| Payroll | ✅ | ✅ | ✅ | ✅ | GET /v1/payroll, POST /v1/payroll, PATCH /v1/payroll/:id, DELETE /v1/payroll/:id |
| Performance | ✅ | ✅ | ✅ | ✅ | GET /v1/performance, POST /v1/performance, PATCH /v1/performance/:id, DELETE /v1/performance/:id |
| Calendar | ✅ | ✅ | ✅ | ✅ | GET /v1/calendar, POST /v1/calendar, PATCH /v1/calendar/:id, DELETE /v1/calendar/:id |
| Holidays | ✅ | ✅ | ✅ | ✅ | GET /v1/holidays, POST /v1/holidays, PATCH /v1/holidays/:id, DELETE /v1/holidays/:id |
| Approvals | ✅ | ✅ | ✅ | ✅ | GET /v1/approvals, POST /v1/approvals, PATCH /v1/approvals/:id, DELETE /v1/approvals/:id |
| Clients | ✅ | ✅ | ✅ | ✅ | GET /v1/clients, POST /v1/clients, PATCH /v1/clients/:id, DELETE /v1/clients/:id |
| Subscriptions | ✅ | ✅ | ✅ | ✅ | GET /v1/subscriptions, POST /v1/subscriptions, PATCH /v1/subscriptions/:id, DELETE /v1/subscriptions/:id |
| Tasks | ✅ | ✅ | ✅ | ✅ | GET /v1/tasks, POST /v1/tasks, PATCH /v1/tasks/:id, DELETE /v1/tasks/:id |
| Invoices | ✅ | ✅ | ✅ | ✅ | GET /v1/invoices, POST /v1/invoices, PATCH /v1/invoices/:id, DELETE /v1/invoices/:id |
| Company Settings | ✅ | ✅ | ✅ | ✅ | GET /v1/company-settings, POST /v1/company-settings, PATCH /v1/company-settings/:id, DELETE /v1/company-settings/:id |
| Leads | ✅ | ✅ | ✅ | ✅ | GET /v1/leads, POST /v1/leads, PATCH /v1/leads/:id, DELETE /v1/leads/:id |
| Payments | ✅ | ✅ | ✅ | ✅ | GET /v1/payments, POST /v1/payments, PATCH /v1/payments/:id, DELETE /v1/payments/:id |
| Transactions | ✅ | ✅ | ✅ | ✅ | GET /v1/transactions, POST /v1/transactions, PATCH /v1/transactions/:id, DELETE /v1/transactions/:id |
| Reports | ✅ | ✅ | ✅ | ✅ | GET /v1/reports, POST /v1/reports, PATCH /v1/reports/:id, DELETE /v1/reports/:id |
| Communications | ✅ | ✅ | ✅ | ✅ | GET /v1/communications, POST /v1/communications, PATCH /v1/communications/:id, DELETE /v1/communications/:id |
| Forums | ✅ | ✅ | ✅ | ✅ | GET /v1/forum, POST /v1/forum, PATCH /v1/forum/:id, DELETE /v1/forum/:id |
| Badges | ✅ | ✅ | ✅ | ✅ | GET /v1/badges, POST /v1/badges, PATCH /v1/badges/:id, DELETE /v1/badges/:id |
| Certificates | ✅ | ✅ | ✅ | ✅ | GET /v1/certificates, POST /v1/certificates, PATCH /v1/certificates/:id, DELETE /v1/certificates/:id |
| Projects | ✅ | ✅ | ✅ | ✅ | GET /v1/projects, POST /v1/projects, PATCH /v1/projects/:id, DELETE /v1/projects/:id |
| Mind Maps | ✅ | ✅ | ✅ | ✅ | GET /v1/mindmaps, POST /v1/mindmaps, PATCH /v1/mindmaps/:id, DELETE /v1/mindmaps/:id |
| Payslips | ✅ | ✅ | ✅ | ✅ | GET /v1/payslips, POST /v1/payslips, PATCH /v1/payslips/:id, DELETE /v1/payslips/:id |
| Auth & Users | ✅ | ✅ | ✅ | ✅ | GET /v1/users, POST /v1/users, PATCH /v1/users/:id, DELETE /v1/users/:id |
| Roles | ✅ | ✅ | ✅ | ✅ | GET /v1/role, POST /v1/role, PATCH /v1/role/:id, DELETE /v1/role/:id |
| System Settings | ✅ | ✅ | ✅ | ✅ | GET /v1/system, POST /v1/system, PATCH /v1/system/:id, DELETE /v1/system/:id |
| Audit Logs | ✅ | ✅ | ✅ | ✅ | GET /v1/audit-logs, POST /v1/audit-logs, PATCH /v1/audit-logs/:id, DELETE /v1/audit-logs/:id |
| Health Checks | ✅ | ❌ | ❌ | ❌ | GET /health |
| Monitoring | ✅ | ✅ | ✅ | ✅ | GET /v1/monitoring, POST /v1/monitoring, PATCH /v1/monitoring/:id, DELETE /v1/monitoring/:id |

## 3. Access Boundaries
- No restrictions; full system access including creation, modification, and deletion of any resource.
- Can manage all users, roles, permissions, and system-wide configurations.
- Has privileged access to audit logs, API keys, and tenant-level operations.

## 4. User Flow & Typical Actions
- Onboard new users, assign roles, and configure global settings.
- Review and approve high‑value transactions, changes, or system upgrades.
- Run system‑wide reports, backup configurations, and manage integrations.
- Enforce security policies across the organization and revoke access as needed.

## 5. Compliance & Security Considerations
- All actions are logged with user ID, timestamp, and IP address.
- Regular rotation of privileged credentials; MFA enforced for all admin sessions.
- Access to sensitive data (e.g., payroll, personal records) is audited and requires justification.
- Quarterly access reviews; escalation path for emergency overrides documented.

Generated from ackend/src/config/constants.js ROLE_PERMISSIONS and ackend/src/routes/index.js.
