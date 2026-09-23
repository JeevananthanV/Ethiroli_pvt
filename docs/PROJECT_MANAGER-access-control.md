# PROJECT_MANAGER Access Control

## 1. Role Title and Summary
- **Role**: Project Manager  
- **Purpose**: Oversees client projects, subscriptions, tasks, invoices, and company settings. Provides full CRUD for project-related resources and read/write for calendar, approvals, and associated modules.  
- **Portal Slug**: `pm`  
- **MFA Required**: No  
- **Session Duration**: 8 hours  
- **Cookie Path**: `/app/pm`

## 2. Permission Matrix
| Resource / Module | Read | Create | Update | Delete | API Endpoints |
|-------------------|------|--------|--------|--------|----------------|
| Employees | ? | ? | ? | ? | *No permissions* |
| Interns | ? | ? | ? | ? | *No permissions* |
| Attendance | ? | ? | ? | ? | *No permissions* |
| Leaves | ? | ? | ? | ? | *No permissions* |
| Courses | ? | ? | ? | ? | *No permissions* |
| Modules | ? | ? | ? | ? | *No permissions* |
| Lessons | ? | ? | ? | ? | *No permissions* |
| Enrollments | ? | ? | ? | ? | *No permissions* |
| Quizzes | ? | ? | ? | ? | *No permissions* |
| Assignments | ? | ? | ? | ? | *No permissions* |
| Interviews | ? | ? | ? | ? | *No permissions* |
| Payroll | ? | ? | ? | ? | *No permissions* |
| Performance | ? | ? | ? | ? | *No permissions* |
| Calendar | ? | ? | ? | ? | `GET /v1/calendar`, `POST /v1/calendar`, `PATCH /v1/calendar/:id`, `DELETE /v1/calendar/:id` |
| Holidays | ? | ? | ? | ? | *No permissions* |
| Approvals | ? | ? | ? | ? | `GET /v1/approvals`, `POST /v1/approvals`, `PATCH /v1/approvals/:id`, `DELETE /v1/approvals/:id` |
| Clients | ? | ? | ? | ? | `GET /v1/clients`, `POST /v1/clients`, `PATCH /v1/clients/:id`, `DELETE /v1/clients/:id` |
| Subscriptions | ? | ? | ? | ? | `GET /v1/subscriptions`, `POST /v1/subscriptions`, `PATCH /v1/subscriptions/:id`, `DELETE /v1/subscriptions/:id` |
| Tasks | ? | ? | ? | ? | `GET /v1/tasks`, `POST /v1/tasks`, `PATCH /v1/tasks/:id`, `DELETE /v1/tasks/:id` |
| Invoices | ? | ? | ? | ? | `GET /v1/invoices`, `POST /v1/invoices`, `PATCH /v1/invoices/:id`, `DELETE /v1/invoices/:id` |
| Company Settings | ? | ? | ? | ? | `GET /v1/company-settings`, `POST /v1/company-settings`, `PATCH /v1/company-settings/:id`, `DELETE /v1/company-settings/:id` |
| Leads | ? | ? | ? | ? | *No permissions* |
| Payments | ? | ? | ? | ? | *No permissions* |
| Transactions | ? | ? | ? | ? | *No permissions* |
| Reports | ? | ? | ? | ? | *No permissions* |
| Communications | ? | ? | ? | ? | *No permissions* |
| Forums | ? | ? | ? | ? | *No permissions* |
| Badges | ? | ? | ? | ? | *No permissions* |
| Certificates | ? | ? | ? | ? | *No permissions* |
| Projects | ? | ? | ? | ? | *No permissions* |
| Mind Maps | ? | ? | ? | ? | *No permissions* |
| Payslips | ? | ? | ? | ? | *No permissions* |
| Auth & Users | ? | ? | ? | ? | *No permissions* |
| Roles | ? | ? | ? | ? | *No permissions* |
| System Settings | ? | ? | ? | ? | *No permissions* |
| Audit Logs | ? | ? | ? | ? | *No permissions* |
| Health Checks | ? | ? | ? | ? | `GET /health` |
| Monitoring | ? | ? | ? | ? | *No permissions* |

## 3. Access Boundaries
- No access to HR, finance, or tuition modules.
- Cannot modify system-wide configurations or user roles.
- Project management is limited to own project portfolio; cross-tenant access not allowed.
- No direct access to payroll or payment processing.

## 4. User Flow & Typical Actions
- Create and update client subscriptions and project tasks.
- Generate and manage invoices linked to projects.
- Review and approve project-related approvals.
- Schedule project milestones and resources via calendar.
- Track project progress and generate status reports for stakeholders.

## 5. Compliance & Security Considerations
- Project data is confidential; access logged and reviewed.
- All project-related approvals are audited for compliance.
- MFA optional but recommended for sensitive project data.
- Data retention aligns with project lifecycle; archived projects retained per policy.

Generated from `backend/src/config/constants.js` `ROLE_PERMISSIONS` and `backend/src/routes/index.js`.