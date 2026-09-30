# STUDENT Access Control

## 1. Role Title and Summary
- **Role**: Student  
- **Purpose**: Enrolls in courses, accesses learning materials, participates in assessments, and tracks progress. Provides full CRUD for enrollments, quizzes, assignments, projects, mind maps, and read/write for courses, calendar, forums, badges, certificates.  
- **Portal Slug**: `student`  
- **MFA Required**: No  
- **Session Duration**: 24 hours  
- **Cookie Path**: `/app/student`

## 2. Permission Matrix
| Resource / Module | Read | Create | Update | Delete | API Endpoints |
|-------------------|------|--------|--------|--------|----------------|
| Employees | ? | ? | ? | ? | *No permissions* |
| Interns | ? | ? | ? | ? | *No permissions* |
| Attendance | ? | ? | ? | ? | *No permissions* |
| Leaves | ? | ? | ? | ? | *No permissions* |
| Courses | ? | ? | ? | ? | `GET /v1/courses` |
| Modules | ? | ? | ? | ? | *No permissions* |
| Lessons | ? | ? | ? | ? | *No permissions* |
| Enrollments | ? | ? | ? | ? | `GET /v1/enrollments`, `POST /v1/enrollments`, `PATCH /v1/enrollments/:id`, `DELETE /v1/enrollments/:id` |
| Quizzes | ? | ? | ? | ? | `GET /v1/quizzes`, `POST /v1/quizzes`, `PATCH /v1/quizzes/:id`, `DELETE /v1/quizzes/:id` |
| Assignments | ? | ? | ? | ? | `GET /v1/assignments`, `POST /v1/assignments`, `PATCH /v1/assignments/:id`, `DELETE /v1/assignments/:id` |
| Interviews | ? | ? | ? | ? | *No permissions* |
| Payroll | ? | ? | ? | ? | *No permissions* |
| Performance | ? | ? | ? | ? | *No permissions* |
| Calendar | ? | ? | ? | ? | `GET /v1/calendar`, `POST /v1/calendar`, `PATCH /v1/calendar/:id`, `DELETE /v1/calendar/:id` |
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
| Communications | ? | ? | ? | ? | *No permissions* |
| Forums | ? | ? | ? | ? | `GET /v1/forum`, `POST /v1/forum`, `PATCH /v1/forum/:id`, `DELETE /v1/forum/:id` |
| Badges | ? | ? | ? | ? | `GET /v1/badges` |
| Certificates | ? | ? | ? | ? | `GET /v1/certificates` |
| Projects | ? | ? | ? | ? | `GET /v1/projects`, `POST /v1/projects`, `PATCH /v1/projects/:id`, `DELETE /v1/projects/:id` |
| Mind Maps | ? | ? | ? | ? | `GET /v1/mindmaps`, `POST /v1/mindmaps`, `PATCH /v1/mindmaps/:id`, `DELETE /v1/mindmaps/:id` |
| Payslips | ? | ? | ? | ? | *No permissions* |
| Auth & Users | ? | ? | ? | ? | *No permissions* |
| Roles | ? | ? | ? | ? | *No permissions* |
| System Settings | ? | ? | ? | ? | *No permissions* |
| Audit Logs | ? | ? | ? | ? | *No permissions* |
| Health Checks | ? | ? | ? | ? | `GET /health` |
| Monitoring | ? | ? | ? | ? | *No permissions* |

## 3. Access Boundaries
- No access to financial or HR modules.
- Limited to own enrollment and learning content; cannot manage other students.
- No system administration rights.
- Cannot view or modify employee or payroll data.

## 4. User Flow & Typical Actions
- Browse and enroll in courses.
- Complete quizzes, assignments, and projects.
- Participate in discussion forums.
- Schedule study sessions via calendar.
- View earned badges and certificates.

## 5. Compliance & Security Considerations
- Student data is sensitive; access logged and reviewed.
- MFA optional but recommended for account security.
- Data retention follows educational regulations; automatic purging after program completion.
- All student actions are audited; escalation path for academic disputes documented.

Generated from `backend/src/config/constants.js` `ROLE_PERMISSIONS` and `backend/src/routes/index.js`.
