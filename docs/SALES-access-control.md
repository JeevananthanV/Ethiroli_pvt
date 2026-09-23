# SALES Access Control

## 1. Role Title and Summary
- **Role**: Sales  
- **Purpose**: Manages leads, clients, and sales‑related activities. Has full CRUD for leads and read access for clients, plus calendar integration for scheduling.  
- **Portal Slug**: \sales\  
- **MFA Required**: No  
- **Session Duration**: 8 hours  
- **Cookie Path**: \/app/sales\

## 2. Permission Matrix
| Resource / Module | Read | Create | Update | Delete | API Endpoints |
|-------------------|------|--------|--------|--------|----------------|
| Employees | \u2717 | \u2717 | \u2717 | \u2717 | *No permissions* |
| Interns | \u2717 | \u2717 | \u2717 | \u2717 | *No permissions* |
| Attendance | \u2717 | \u2717 | \u2717 | \u2717 | *No permissions* |
| Leaves | \u2717 | \u2717 | \u2717 | \u2717 | *No permissions* |
| Courses | \u2717 | \u2717 | \u2717 | \u2717 | *No permissions* |
| Modules | \u2717 | \u2717 | \u2717 | \u2717 | *No permissions* |
| Lessons | \u2717 | \u2717 | \u2717 | \u2717 | *No permissions* |
| Enrollments | \u2717 | \u2717 | \u2717 | \u2717 | *No permissions* |
| Quizzes | \u2717 | \u2717 | \u2717 | \u2717 | *No permissions* |
| Assignments | \u2717 | \u2717 | \u2717 | \u2717 | *No permissions* |
| Interviews | \u2717 | \u2717 | \u2717 | \u2717 | *No permissions* |
| Payroll | \u2717 | \u2717 | \u2717 | \u2717 | *No permissions* |
| Performance | \u2717 | \u2717 | \u2717 | \u2717 | *No permissions* |
| Calendar | \u2713 | \u2713 | \u2713 | \u2713 | \GET /v1/calendar\, \POST /v1/calendar\, \PATCH /v1/calendar/:id\, \DELETE /v1/calendar/:id\ |
| Holidays | \u2717 | \u2717 | \u2717 | \u2717 | *No permissions* |
| Approvals | \u2717 | \u2717 | \u2717 | \u2717 | *No permissions* |
| Clients | \u2713 | \u2717 | \u2717 | \u2717 | \GET /v1/clients\ |
| Subscriptions | \u2717 | \u2717 | \u2717 | \u2717 | *No permissions* |
| Tasks | \u2717 | \u2717 | \u2717 | \u2717 | *No permissions* |
| Invoices | \u2717 | \u2717 | \u2717 | \u2717 | *No permissions* |
| Company Settings | \u2717 | \u2717 | \u2717 | \u2717 | *No permissions* |
| Leads | \u2713 | \u2713 | \u2713 | \u2713 | \GET /v1/leads\, \POST /v1/leads\, \PATCH /v1/leads/:id\, \DELETE /v1/leads/:id\ |
| Payments | \u2717 | \u2717 | \u2717 | \u2717 | *No permissions* |
| Transactions | \u2717 | \u2717 | \u2717 | \u2717 | *No permissions* |
| Reports | \u2717 | \u2717 | \u2717 | \u2717 | *No permissions* |
| Communications | \u2717 | \u2717 | \u2717 | \u2717 | *No permissions* |
| Forums | \u2717 | \u2717 | \u2717 | \u2717 | *No permissions* |
| Badges | \u2717 | \u2717 | \u2717 | \u2717 | *No permissions* |
| Certificates | \u2717 | \u2717 | \u2717 | \u2717 | *No permissions* |
| Projects | \u2717 | \u2717 | \u2717 | \u2717 | *No permissions* |
| Mind Maps | \u2717 | \u2717 | \u2717 | \u2717 | *No permissions* |
| Payslips | \u2717 | \u2717 | \u2717 | \u2717 | *No permissions* |
| Auth & Users | \u2717 | \u2717 | \u2717 | \u2717 | *No permissions* |
| Roles | \u2717 | \u2717 | \u2717 | \u2717 | *No permissions* |
| System Settings | \u2717 | \u2717 | \u2717 | \u2717 | *No permissions* |
| Audit Logs | \u2717 | \u2717 | \u2717 | \u2717 | *No permissions* |
| Health Checks | \u2717 | \u2717 | \u2717 | \u2717 | \GET /health\ |
| Monitoring | \u2717 | \u2717 | \u2717 | \u2717 | *No permissions* |

## 3. Access Boundaries
- No access to financial or HR modules.
- Cannot create or modify client records; only view.
- Sales actions limited to lead management and calendar scheduling.
- No access to system configurations or role definitions.

## 4. User Flow & Typical Actions
- Capture and update lead information.
- Schedule client meetings and follow‑ups via calendar.
- Generate lead reports and pipeline visualizations.
- Convert qualified leads into clients (view only).

## 5. Compliance & Security Considerations
- Lead data is PII; access logged and requires justification.
- MFA optional but recommended for account security.
- Data retention aligns with sales policies; automatic purging of inactive leads after 90 days.
- All sales communications are archived for audit.

Generated from \ackend/src/config/constants.js\ \ROLE_PERMISSIONS\ and \ackend/src/routes/index.js\.