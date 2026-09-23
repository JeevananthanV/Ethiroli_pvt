# TUTOR Access Control

## 1. Role Title and Summary
- **Role**: Tutor  
- **Purpose**: Delivers courses, manages lessons, quizzes, assignments, and interacts with students. Has full CRUD for tutoring‑related resources and limited read/write for calendar, forums, badges, and certificates.  
- **Portal Slug**: \	utor\  
- **MFA Required**: No  
- **Session Duration**: 8 hours  
- **Cookie Path**: \/app/tutor\

## 2. Permission Matrix
| Resource / Module | Read | Create | Update | Delete | API Endpoints |
|-------------------|------|--------|--------|--------|----------------|
| Employees | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Interns | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Attendance | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Leaves | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Courses | ✅ | ✅ | ✅ | ✅ | \GET /v1/courses\, \POST /v1/courses\, \PATCH /v1/courses/:id\, \DELETE /v1/courses/:id\ |
| Modules | ✅ | ✅ | ✅ | ✅ | \GET /v1/modules\, \POST /v1/modules\, \PATCH /v1/modules/:id\, \DELETE /v1/modules/:id\ |
| Lessons | ✅ | ✅ | ✅ | ✅ | \GET /v1/lessons\, \POST /v1/lessons\, \PATCH /v1/lessons/:id\, \DELETE /v1/lessons/:id\ |
| Enrollments | ✅ | ✅ | ✅ | ✅ | \GET /v1/enrollments\, \POST /v1/enrollments\, \PATCH /v1/enrollments/:id\, \DELETE /v1/enrollments/:id\ |
| Quizzes | ✅ | ✅ | ✅ | ✅ | \GET /v1/quizzes\, \POST /v1/quizzes\, \PATCH /v1/quizzes/:id\, \DELETE /v1/quizzes/:id\ |
| Assignments | ✅ | ✅ | ✅ | ✅ | \GET /v1/assignments\, \POST /v1/assignments\, \PATCH /v1/assignments/:id\, \DELETE /v1/assignments/:id\ |
| Interviews | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Payroll | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Performance | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Calendar | ✅ | ✅ | ✅ | ✅ | \GET /v1/calendar\, \POST /v1/calendar\, \PATCH /v1/calendar/:id\, \DELETE /v1/calendar/:id\ |
| Holidays | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Approvals | ❌ | ❌ | ❌ | ❌ | *No permissions* |
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
| Forums | ✅ | ✅ | ✅ | ✅ | \GET /v1/forum\, \POST /v1/forum\, \PATCH /v1/forum/:id\, \DELETE /v1/forum/:id\ |
| Badges | ✅ | ❌ | ❌ | ❌ | \GET /v1/badges\ |
| Certificates | ✅ | ❌ | ❌ | ❌ | \GET /v1/certificates\ |
| Projects | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Mind Maps | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Payslips | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Auth & Users | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Roles | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| System Settings | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Audit Logs | ❌ | ❌ | ❌ | ❌ | *No permissions* |
| Health Checks | ❌ | ❌ | ❌ | ❌ | \GET /health\ |
| Monitoring | ❌ | ❌ | ❌ | ❌ | *No permissions* |

## 3. Access Boundaries
- No access to financial, client, or project modules.
- Cannot view or modify employee records beyond course enrollment.
- Tutor actions are confined to learning content; no system administration.
- Cannot manage user roles or global settings.

## 4. User Flow & Typical Actions
- Create and update course content (courses, modules, lessons).
- Design and grade quizzes and assignments.
- Participate in discussion forums and provide feedback.
- Schedule and attend tutoring sessions via calendar.
- Issue badges and certificates to completed students.

## 5. Compliance & Security Considerations
- Tutor‑created content is reviewed for compliance before publication.
- All tutor actions are logged; sessions monitored for security.
- Data handling follows educational privacy regulations (e.g., FERPA).
- Access to student data is restricted to enrolled courses only.

Generated from \ackend/src/config/constants.js\ \ROLE_PERMISSIONS\ and \ackend/src/routes/index.js\.