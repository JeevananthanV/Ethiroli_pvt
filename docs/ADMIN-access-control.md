# ADMIN Access Control

## 1. Role Title and Summary
**Role Name:** ADMIN
**Purpose:** Administrative access with full system privileges for platform-wide management and oversight
**Portal Slug:** admin
**MFA Required:** Yes
**Session Duration:** 8 hours

## 2. Permission Matrix
| Resource / Module | Read | Create | Update | Delete | API Endpoints |
|-------------------|------|--------|--------|--------|---------------|
| Authentication | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/auth |
| Users | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/users |
| Leads | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/leads |
| Security | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/security |
| Feature Flags | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/feature-flags |
| Governance | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/admin/governance |
| Contacts | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/contact-messages |
| Candidates | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/candidates |
| Career Applications | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/career-applications |
| Job Board | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/jobs-board |
| Webhooks | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/webhooks |
| Integrations | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/integrations |
| Activity Feed | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/activity-feed |
| Audit Logs | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/audit-logs |
| System | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/system |
| Roles | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/role |
| Admin Auth | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/admin/auth |
| Vendor Auth | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/vendor/auth |
| Client Auth | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/client/auth |
| Admin | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/admin |
| Vendor | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/vendor |
| Client Portal | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/client |
| Employees | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/employees |
| Interns | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/interns |
| Attendance | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/attendance |
| Leaves | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/leaves |
| Courses | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/courses |
| Modules | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/modules |
| Lessons | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/lessons |
| Enrollments | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/enrollments |
| Quizzes | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/quizzes |
| Question Bank | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/question-bank |
| Assignments | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/assignments |
| Clients | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/clients |
| Subscriptions | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/subscriptions |
| Tasks | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/tasks |
| Transactions | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/transactions |
| Invoices | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/invoices |
| Payments | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/payments |
| Live Quizzes | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/live-quizzes |
| Forum | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/forum |
| Badges | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/badges |
| Communications | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/communications |
| Templates | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/templates |
| Providers | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/providers |
| Jobs | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/jobs |
| Interviews | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/interviews |
| Payroll | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/payroll |
| Performance | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/performance |
| Calendar | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/calendar |
| Event Types | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/event-types |
| Holidays | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/holidays |
| Workflows | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/workflows |
| Approvals | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/approvals |
| Company Settings | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/company-settings |
| Recurring Schedules | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/recurring-schedules |
| Projects | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/projects |
| Mind Maps | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/mind-maps |
| Certificates | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/certificates |
| Monitoring | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/monitoring |
| Tenants | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/tenants |
| Marketplace | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/marketplace |
| Cart | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/cart |
| Coupons | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/coupons |
| Reports | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/reports |
| Scheduled Reports | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/scheduled-reports |
| API Keys | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/api-keys |
| Orders | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/orders |
| Predictive | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/predictive |
| Automation | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/automation |
| Notifications | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/notifications |
| HR Dashboard | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/hr-dashboard |
| Employee Documents | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/employee-documents |
| Exit | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/exit |
| Employee Portal | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/employee |
| LMS | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/lms |
| Operations | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/operations |
| PM | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/pm |
| Finance | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/finance |
| Sales | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/sales |
| Reception | Yes | Yes | Yes | Yes | GET, POST, PUT, DELETE /v1/reception |

## 3. Access Boundaries
- No explicit access boundaries - ADMIN has unrestricted access to all system resources and operations

## 4. User Flow & Typical Actions
- Manage user accounts, roles, and permissions through /v1/users and /v1/role endpoints
- Configure platform settings and governance policies via /v1/company-settings and /v1/admin/governance
- Oversee business operations across sales, finance, and HR dashboards
- Monitor system activity and audit trails using /v1/audit-logs and /v1/system
- Manage integrations and webhooks via /v1/integrations and /v1/webhooks

## 5. Compliance & Security Considerations
- All administrative actions are logged for audit and compliance purposes
- Session timeout enforced after 8 hours of inactivity
- Multi-factor authentication required for all login attempts
- Access to sensitive data requires appropriate authorization and justification
- Regular review of administrative privileges recommended
- Generated from ackend/src/config/constants.js ROLE_PERMISSIONS and ackend/src/routes/index.js.
