# FINANCE Access Control

## 1. Role Title and Summary
- **Role**: Finance  
- **Purpose**: Manages invoicing, payments, transactions, payroll, and financial reports. Provides full CRUD for finance‑related resources and read/write for calendar and related modules.  
- **Portal Slug**: `finance`
- **MFA Required**: No  
- **Session Duration**: 8 hours  
- **Cookie Path**: `/app/finance`

## 2. Permission Matrix
| Resource / Module | Read | Create | Update | Delete | API Endpoints |
|-------------------|------|--------|--------|--------|----------------|
| Employees | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Interns | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Attendance | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Leaves | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Courses | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Modules | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Lessons | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Enrollments | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Quizzes | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Assignments | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Interviews | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Payroll | ✅ | ✅ | ✅ | ✅ | `GET /v1/payroll`, `POST /v1/payroll`, `PATCH /v1/payroll/:id`, `DELETE /v1/payroll/:id` |
| Performance | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Calendar | ✅ | ✅ | ✅ | ✅ | `GET /v1/calendar`, `POST /v1/calendar`, `PATCH /v1/calendar/:id`, `DELETE /v1/calendar/:id` |
| Holidays | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Approvals | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Clients | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Subscriptions | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Tasks | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Invoices | ✅ | ✅ | ✅ | ✅ | `GET /v1/invoices`, `POST /v1/invoices`, `PATCH /v1/invoices/:id`, `DELETE /v1/invoices/:id` |
| Company Settings | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Leads | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Payments | ✅ | ✅ | ✅ | ✅ | `GET /v1/payments`, `POST /v1/payments`, `PATCH /v1/payments/:id`, `DELETE /v1/payments/:id` |
| Transactions | ✅ | ✅ | ✅ | ✅ | `GET /v1/transactions`, `POST /v1/transactions`, `PATCH /v1/transactions/:id`, `DELETE /v1/transactions/:id` |
| Reports | ✅ | ✅ | ✅ | ✅ | `GET /v1/reports`, `POST /v1/reports`, `PATCH /v1/reports/:id`, `DELETE /v1/reports/:id` |
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
- No access to HR, client, or project modules.
- Cannot modify system‑wide configurations or user roles.
- Financial data is highly sensitive; access is logged and reviewed.
- Cannot process payroll for employees outside finance scope.

## 4. User Flow & Typical Actions
- Create and update invoices, payments, and transaction records.
- Manage payroll runs and generate payslips.
- Produce financial reports and analytics.
- Schedule finance‑related calendar events and approvals.
- Reconcile transactions and handle refunds.

## 5. Compliance & Security Considerations
- All financial actions are logged with user, timestamp, and amount.
- MFA optional but recommended for high‑value operations.
- Data retention follows fiscal regulations; audit trails immutable.
- Access to finance modules requires quarterly review and justification.

Generated from `backend/src/config/constants.js` `ROLE_PERMISSIONS` and `backend/src/routes/index.js`.
