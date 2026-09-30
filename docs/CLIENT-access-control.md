# CLIENT Access Control

## 1. Role Title and Summary
- **Role**: Client  
- **Purpose**: Provides self-service access to view and manage client-specific resources such as subscriptions, contacts, and communication preferences. Has read-only access to most modules; can create/update client-profile data.  
- **Portal Slug**: client  
- **MFA Required**: No  
- **Session Duration**: 24 hours  
- **Cookie Path**: /app/client

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
| Calendar | ? | ? | ? | ? | *No permissions* |
| Holidays | ? | ? | ? | ? | *No permissions* |
| Approvals | ? | ? | ? | ? | *No permissions* |
| Clients | ? | ? | ? | ? | GET /v1/clients, POST /v1/clients, PATCH /v1/clients/:id, DELETE /v1/clients/:id |
| Subscriptions | ? | ? | ? | ? | GET /v1/subscriptions, POST /v1/subscriptions, PATCH /v1/subscriptions/:id, DELETE /v1/subscriptions/:id |
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
- No access to internal HR, finance, or project modules.
- Client actions are limited to own profile and subscriptions.
- Cannot modify system settings or user roles.
- No administrative rights.

## 4. User Flow & Typical Actions
- View and update client profile information.
- Manage subscription preferences and plan changes.
- Submit and track communication requests.
- Access relevant documentation and support resources.

## 5. Compliance & Security Considerations
- Client data is PII; access logged and reviewed.
- MFA optional but recommended for account security.
- Data retention follows client agreements; automatic purging per policy.
- All client actions are audited; escalation path for support documented.

Generated from ackend/src/config/constants.js ROLE_PERMISSIONS and ackend/src/routes/index.js.
