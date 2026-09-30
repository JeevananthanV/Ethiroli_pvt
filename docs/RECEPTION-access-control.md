# RECEPTION Access Control

## 1. Role Title and Summary
- **Role**: Reception  
- **Purpose**: Manages front-desk operations: attendance, leave requests, basic communications, and calendar events. Provides full CRUD for attendance and leave, and read/write for communications and calendar.  
- **Portal Slug**: eception  
- **MFA Required**: No  
- **Session Duration**: 8 hours  
- **Cookie Path**: /app/reception

## 2. Permission Matrix
| Resource / Module | Read | Create | Update | Delete | API Endpoints |
|-------------------|------|--------|--------|--------|----------------|
| Employees | ? | ? | ? | ? | *No permissions* |
| Interns | ? | ? | ? | ? | *No permissions* |
| Attendance | ? | ? | ? | ? | GET /v1/attendance, POST /v1/attendance, PATCH /v1/attendance/:id, DELETE /v1/attendance/:id |
| Leaves | ? | ? | ? | ? | GET /v1/leaves |
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
| Tasks | ? | ? | ? | ? | *No permissions* |
| Invoices | ? | ? | ? | ? | *No permissions* |
| Company Settings | ? | ? | ? | ? | *No permissions* |
| Leads | ? | ? | ? | ? | *No permissions* |
| Payments | ? | ? | ? | ? | *No permissions* |
| Transactions | ? | ? | ? | ? | *No permissions* |
| Reports | ? | ? | ? | ? | *No permissions* |
| Communications | ? | ? | ? | ? | GET /v1/communications, POST /v1/communications, PATCH /v1/communications/:id, DELETE /v1/communications/:id |
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
| Health Checks | ? | ? | ? | ? | GET /health |
| Monitoring | ? | ? | ? | ? | *No permissions* |

## 3. Access Boundaries
- No access to financial, HR, or project modules.
- Limited to attendance and leave for employees; cannot view payroll or performance.
- Cannot modify client or lead data.
- No system administration rights.

## 4. User Flow & Typical Actions
- Record employee attendance and manage leave approvals.
- Process visitor communications and schedule appointments via calendar.
- Update and respond to internal communications.
- Generate basic reports on attendance trends.

## 5. Compliance & Security Considerations
- Attendance data is sensitive; access logged and reviewed.
- MFA optional but recommended for account security.
- Data retention per labor regulations; automatic archiving after policy period.
- All reception actions are audited; escalation path for exceptions documented.

Generated from ackend/src/config/constants.js ROLE_PERMISSIONS and ackend/src/routes/index.js.
