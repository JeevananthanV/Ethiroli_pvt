# VENDOR Access Control

## 1. Role Title and Summary
- **Role**: Vendor  
- **Purpose**: Provides limited self‑service access for vendors to manage profile, view invoices, and submit communications. Has read/write for own profile and communications; read for invoices and related data.  
- **Portal Slug**: `vendor`  
- **MFA Required**: No  
- **Session Duration**: 24 hours  
- **Cookie Path**: `/app/vendor`

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
| Payroll | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Performance | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Calendar | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Holidays | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Approvals | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Clients | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Subscriptions | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Tasks | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Invoices | ✅ | ❌ | ❌ | ❌ | `GET /v1/invoices` |
| Company Settings | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Leads | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Payments | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Transactions | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Reports | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Communications | ✅ | ✅ | ✅ | ✅ | `GET /v1/communications`, `POST /v1/communications`, `PATCH /v1/communications/:id`, `DELETE /v1/communications/:id` |
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
- No access to internal HR, employee, or project modules.
- Limited to own vendor profile and communications.
- Cannot modify system settings or user roles.
- No administrative rights.

## 4. User Flow & Typical Actions
- View and update vendor profile details.
- Submit and track communications with the organization.
- Access relevant invoices and billing information.
- Manage account settings and preferences.

## 5. Compliance & Security Considerations
- Vendor data is confidential; access logged and reviewed.
- MFA optional but recommended for account security.
- Data retention follows vendor agreements; automatic purging per policy.
- All vendor actions are audited; escalation path for support documented.

Generated from `backend/src/config/constants.js` `ROLE_PERMISSIONS` and `backend/src/routes/index.js`.
