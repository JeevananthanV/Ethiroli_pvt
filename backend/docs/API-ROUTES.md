# Ethiroli Backend — API Routes Reference

> **Base URL**: `http://localhost:5000/api/v1`
> **API Version**: `v1` (passed via `X-API-Version` response header)
> **Content-Type**: `application/json`
> **Authentication**: Session cookie (`session_token`) or `X-API-Key` header for service-to-service calls.

## Project Structure

```
backend/
├── docs/
│   └── API-ROUTES.md          ← This file
├── scripts/
│   ├── create-table.js
│   ├── seed-hr-data.js
│   └── ...
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   ├── controllers/
│   ├── graphql/
│   ├── integrations/
│   ├── middleware/
│   ├── migrations/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── socket/
│   └── utils/
├── tests/
├── .env.example
├── package.json
├── README.md
└── schema.sql
```

---

## Table of Contents

1. [Health & Liveness](#health--liveness)
2. [Authentication](#authentication)
3. [Users](#users)
4. [Leads](#leads)
5. [Employees](#employees)
6. [Attendance](#attendance)
7. [Leaves](#leaves)
8. [Courses & Learning](#courses--learning)
9. [Payments](#payments)
10. [Invoices](#invoices)
11. [Subscriptions](#subscriptions)
12. [Tasks](#tasks)
13. [Payroll](#payroll)
14. [Performance](#performance)
15. [Calendar & Holidays](#calendar--holidays)
16. [Workflows & Approvals](#workflows--approvals)
17. [Communication & Notifications](#communication--notifications)
18. [Integrations & Webhooks](#integrations--webhooks)
19. [Reports & Analytics](#reports--analytics)
20. [Tenant & Marketplace](#tenant--marketplace)
21. [Error Codes Reference](#error-codes-reference)

---

## Conventions

| Concept | Detail |
|---|---|
| **URL Prefix** | All business routes are mounted under `/api/v1`. Health endpoints are at `/health` (outside `/api`). |
| **Response Envelope** | All responses use `{ success, data, message }` for success and `{ success, message, code, details? }` for errors. |
| **Rate Limits** | Global API: 100 req/min per identity. Auth endpoints: 5 attempts/15 min. Write ops: 30 req/min. |
| **Rate Limit Headers** | `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, `Retry-After` (when exceeded). |
| **Request Tracing** | Every response includes `X-Request-ID`. Use this when reporting issues. |
| **CSRF** | Mutating requests (`POST`, `PUT`, `PATCH`, `DELETE`) must originate from an allowed origin configured in `ALLOWED_ORIGINS`. |

---

## Health & Liveness

Unauthenticated endpoints intended for load balancers, Kubernetes probes, and uptime monitors.

---

### `GET /health`

Basic health check. Returns service status and uptime.

| Field | Value |
|---|---|
| **Auth Required** | No |
| **Rate Limited** | No |
| **Cacheable** | No |

**Response 200**

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2026-01-01T00:00:00.000Z",
    "uptime": 12345
  },
  "message": "Service is healthy"
}
```

---

### `GET /health/live`

Liveness probe. Confirms the Node.js process is running. Returns `200` even if downstream dependencies are degraded.

| Field | Value |
|---|---|
| **Auth Required** | No |
| **Rate Limited** | No |
| **Cacheable** | No |
| **Cache-Control** | `no-cache, no-store, must-revalidate` |

**Response 200**

```json
{
  "success": true,
  "data": {
    "status": "alive",
    "timestamp": "2026-01-01T00:00:00.000Z",
    "uptime": 12345
  },
  "message": "Service is alive"
}
```

---

### `GET /health/ready`

Readiness probe. Verifies database connectivity before accepting traffic.

| Field | Value |
|---|---|
| **Auth Required** | No |
| **Rate Limited** | No |

**Response 200**

```json
{
  "success": true,
  "data": {
    "status": "ready",
    "timestamp": "2026-01-01T00:00:00.000Z",
    "uptime": 12345,
    "database": {
      "connected": true,
      "latencyMs": 2
    }
  },
  "message": "Service is ready to accept traffic"
}
```

**Response 503** (database unreachable)

```json
{
  "success": false,
  "message": "Service is not ready: database connectivity check failed",
  "data": {
    "status": "not_ready",
    "timestamp": "2026-01-01T00:00:00.000Z",
    "database": {
      "connected": false,
      "latencyMs": 5000,
      "error": "ECONNREFUSED ..."
    }
  }
}
```

---

## Authentication

Base path: `/api/v1/auth`

All endpoints in this section are unauthenticated unless otherwise noted.

---

### `POST /api/v1/auth/login`

Authenticates a user and returns a session cookie.

| Field | Value |
|---|---|
| **Auth Required** | No |
| **Rate Limited** | Yes — 5 attempts per 15 min per identity |
| **CSRF Protected** | Yes |

**Request Body**

| Field | Type | Required | Description |
|---|---|---|---|
| `email` | `string` | Yes | Registered email address |
| `password` | `string` | Yes | Account password |

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response 200**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "Jane Doe",
    "role": "EMPLOYEE"
  },
  "message": "Login successful"
}
```

| Error Code | Status | Description |
|---|---|---|
| `AUTHENTICATION_REQUIRED` | 401 | Missing email or password |
| `INVALID_CREDENTIALS` | 401 | Email/password mismatch |
| `ACCOUNT_DEACTIVATED` | 403 | Account is deactivated |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many login attempts |

---

### `POST /api/v1/auth/logout`

Invalidates the current session cookie.

| Field | Value |
|---|---|
| **Auth Required** | No (session cookie required for server-side invalidation) |
| **CSRF Protected** | Yes |

**Response 200**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### `GET /api/v1/auth/me`

Returns the current authenticated user's profile.

| Field | Value |
|---|---|
| **Auth Required** | Yes — session cookie |
| **Rate Limited** | Global API limit |

**Response 200**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "Jane Doe",
    "role": "EMPLOYEE",
    "is_active": true
  },
  "message": "User profile retrieved"
}
```

| Error Code | Status | Description |
|---|---|---|
| `AUTHENTICATION_REQUIRED` | 401 | No valid session cookie |
| `SESSION_EXPIRED` | 401 | Session has expired |

---

## Users

Base path: `/api/v1/users`

---

### `GET /api/v1/users`

Lists all users. Supports pagination and filtering.

| Field | Value |
|---|---|
| **Auth Required** | Yes |
| **Allowed Roles** | `ADMIN`, `SUPER_ADMIN` |
| **Query Params** | `page` (default: 1), `limit` (default: 20), `role`, `search` |

**Response 200**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "Jane Doe",
      "role": "EMPLOYEE",
      "is_active": true,
      "created_at": "2026-01-01T00:00:00.000Z"
    }
  ],
  "message": "Users retrieved"
}
```

---

### `POST /api/v1/users`

Creates a new user account.

| Field | Value |
|---|---|
| **Auth Required** | Yes |
| **Allowed Roles** | `ADMIN`, `SUPER_ADMIN` |
| **Write Rate Limited** | Yes — 30 req/min |

**Request Body**

| Field | Type | Required | Description |
|---|---|---|---|
| `email` | `string` | Yes | Unique email address |
| `password` | `string` | Yes | Min 8 characters |
| `full_name` | `string` | Yes | Display name |
| `role` | `string` | Yes | One of `ROLES` enum values |

**Response 201**

```json
{
  "success": true,
  "data": { "id": "uuid" },
  "message": "User created successfully"
}
```

| Error Code | Status | Description |
|---|---|---|
| `VALIDATION_FAILED` | 400 | Missing or invalid fields |
| `RESOURCE_CONFLICT` | 409 | Email already exists |

---

### `GET /api/v1/users/:id`

Retrieves a single user by ID.

| Field | Value |
|---|---|
| **Auth Required** | Yes |
| **Allowed Roles** | `ADMIN`, `SUPER_ADMIN` |

**Response 200**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "Jane Doe",
    "role": "EMPLOYEE",
    "is_active": true,
    "created_at": "2026-01-01T00:00:00.000Z"
  },
  "message": "User retrieved"
}
```

**Response 404**

```json
{
  "success": false,
  "message": "User not found",
  "code": "NOT_FOUND"
}
```

---

### `PATCH /api/v1/users/:id`

Updates a user's profile.

| Field | Value |
|---|---|
| **Auth Required** | Yes |
| **Allowed Roles** | `ADMIN`, `SUPER_ADMIN` |
| **Write Rate Limited** | Yes |

**Request Body (partial)**

```json
{
  "full_name": "Updated Name",
  "role": "HR"
}
```

**Response 200**

```json
{
  "success": true,
  "data": { "id": "uuid" },
  "message": "User updated successfully"
}
```

---

### `DELETE /api/v1/users/:id`

Soft-deletes a user account.

| Field | Value |
|---|---|
| **Auth Required** | Yes |
| **Allowed Roles** | `SUPER_ADMIN` |

**Response 200**

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## Leads

Base path: `/api/v1/leads`

---

### `POST /api/v1/leads/public/contact`

Public endpoint. Creates a lead without authentication (used on marketing landing pages).

| Field | Value |
|---|---|
| **Auth Required** | No |
| **CSRF Protected** | Yes |
| **Rate Limited** | Global API limit |

**Request Body**

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | `string` | Yes | Prospect full name |
| `email` | `string` | Yes | Prospect email |
| `phone` | `string` | Yes | Prospect phone number |
| `source` | `string` | No | Lead source |
| `notes` | `string` | No | Additional context |

**Response 201**

```json
{
  "success": true,
  "data": { "id": "uuid" },
  "message": "Lead created successfully"
}
```

---

### `GET /api/v1/leads`

Lists leads for the authenticated user or all leads (admin).

| Field | Value |
|---|---|
| **Auth Required** | Yes |
| **Allowed Roles** | `SALES`, `ADMIN`, `SUPER_ADMIN` |
| **Query Params** | `status`, `assigned_to`, `page`, `limit` |

**Response 200**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "John Prospect",
      "email": "john@example.com",
      "phone": "+1234567890",
      "status": "NEW",
      "created_at": "2026-01-01T00:00:00.000Z"
    }
  ],
  "message": "Leads retrieved"
}
```

---

### `POST /api/v1/leads`

Creates a new lead.

| Field | Value |
|---|---|
| **Auth Required** | Yes |
| **Allowed Roles** | `SALES`, `ADMIN`, `SUPER_ADMIN` |
| **Write Rate Limited** | Yes |

**Request Body**

| Field | Type | Required |
|---|---|---|
| `name` | `string` | Yes |
| `email` | `string` | Yes |
| `phone` | `string` | Yes |
| `status` | `string` | No — one of `LEAD_STATUS` |
| `notes` | `string` | No |

**Response 201**

```json
{
  "success": true,
  "data": { "id": "uuid" },
  "message": "Lead created successfully"
}
```

---

### `PATCH /api/v1/leads/:id/status`

Updates lead status.

| Field | Value |
|---|---|
| **Auth Required** | Yes |
| **Allowed Roles** | `SALES`, `ADMIN`, `SUPER_ADMIN` |
| **Additional Middleware** | `requireLeadOwnerOrAdmin` |

**Request Body**

```json
{
  "status": "CONTACTED"
}
```

**Response 200**

```json
{
  "success": true,
  "data": { "id": "uuid", "status": "CONTACTED" },
  "message": "Lead status updated"
}
```

| Error Code | Status | Description |
|---|---|---|
| `INSUFFICIENT_PERMISSIONS` | 403 | Not the lead owner and not an admin |

---

### `DELETE /api/v1/leads/:id`

Deletes a lead.

| Field | Value |
|---|---|
| **Auth Required** | Yes |
| **Allowed Roles** | `ADMIN`, `SUPER_ADMIN` |

**Response 200**

```json
{
  "success": true,
  "message": "Lead deleted successfully"
}
```

---

### `POST /api/v1/leads/:id/follow-up`

Sends a follow-up communication for a lead.

| Field | Value |
|---|---|
| **Auth Required** | Yes |
| **Allowed Roles** | `SALES`, `ADMIN`, `SUPER_ADMIN` |
| **Additional Middleware** | `requireLeadOwnerOrAdmin` |

**Request Body**

| Field | Type | Required | Description |
|---|---|---|---|
| `channel` | `string` | Yes | `EMAIL`, `SMS`, `CALL` |
| `notes` | `string` | No | Follow-up notes |

**Response 200**

```json
{
  "success": true,
  "data": { "id": "uuid" },
  "message": "Follow-up sent"
}
```

---

## Employees

Base path: `/api/v1/employees`

All routes require authentication.

---

### `GET /api/v1/employees`

Lists employees. Supports filtering by department, designation, and status.

| Field | Value |
|---|---|
| **Auth Required** | Yes |
| **Allowed Roles** | `HR`, `ADMIN`, `SUPER_ADMIN` |
| **Query Params** | `department`, `designation`, `status`, `page`, `limit` |

**Response 200**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "employee_id": "EMP-001",
      "full_name": "Jane Doe",
      "email": "jane@example.com",
      "department": "Engineering",
      "designation": "Software Engineer",
      "join_date": "2024-01-15",
      "is_active": true
    }
  ],
  "message": "Employees retrieved"
}
```

---

### `POST /api/v1/employees`

Creates an employee record.

| Field | Value |
|---|---|
| **Auth Required** | Yes |
| **Allowed Roles** | `HR`, `ADMIN` |
| **Write Rate Limited** | Yes |

**Request Body**

| Field | Type | Required |
|---|---|---|
| `full_name` | `string` | Yes |
| `email` | `string` | Yes |
| `phone` | `string` | Yes |
| `department` | `string` | Yes |
| `designation` | `string` | Yes |
| `join_date` | `string (YYYY-MM-DD)` | Yes |

**Response 201**

```json
{
  "success": true,
  "data": { "id": "uuid" },
  "message": "Employee created successfully"
}
```

---

### `GET /api/v1/employees/:id`

Retrieves a single employee record.

| Field | Value |
|---|---|
| **Auth Required** | Yes |
| **Allowed Roles** | `HR`, `ADMIN`, `SUPER_ADMIN` |

---

### `PATCH /api/v1/employees/:id`

Updates employee details.

| Field | Value |
|---|---|
| **Auth Required** | Yes |
| **Allowed Roles** | `HR`, `ADMIN` |
| **Write Rate Limited** | Yes |

---

### `DELETE /api/v1/employees/:id`

Deletes an employee record.

| Field | Value |
|---|---|
| **Auth Required** | Yes |
| **Allowed Roles** | `ADMIN`, `SUPER_ADMIN` |

---

## Attendance

Base path: `/api/v1/attendance`

---

### `GET /api/v1/attendance`

Lists attendance records with optional date range filter.

| Field | Value |
|---|---|
| **Auth Required** | Yes |
| **Allowed Roles** | `HR`, `EMPLOYEE`, `INTERN`, `ADMIN`, `SUPER_ADMIN` |
| **Query Params** | `start_date`, `end_date`, `user_id`, `status` |

**Response 200**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "date": "2026-01-15",
      "status": "PRESENT",
      "check_in": "09:00:00",
      "check_out": "18:00:00",
      "hours_worked": 9
    }
  ],
  "message": "Attendance retrieved"
}
```

---

### `POST /api/v1/attendance`

Marks attendance for a date.

| Field | Value |
|---|---|
| **Auth Required** | Yes |
| **Allowed Roles** | `HR`, `EMPLOYEE`, `INTERN`, `ADMIN`, `SUPER_ADMIN` |
| **Write Rate Limited** | Yes |

**Request Body**

| Field | Type | Required |
|---|---|---|
| `user_id` | `string (uuid)` | Yes |
| `date` | `string (YYYY-MM-DD)` | Yes |
| `status` | `string` | Yes — one of `ATTENDANCE_STATUS` |
| `check_in` | `string (HH:MM:SS)` | No |
| `check_out` | `string (HH:MM:SS)` | No |

---

## Leaves

Base path: `/api/v1/leaves`

---

### `GET /api/v1/leaves`

Lists leave requests.

| Field | Value |
|---|---|
| **Auth Required** | Yes |
| **Allowed Roles** | `HR`, `EMPLOYEE`, `INTERN`, `ADMIN`, `SUPER_ADMIN` |
| **Query Params** | `status`, `user_id`, `start_date`, `end_date` |

---

### `POST /api/v1/leaves`

Creates a new leave request.

| Field | Value |
|---|---|
| **Auth Required** | Yes |
| **Allowed Roles** | `EMPLOYEE`, `INTERN`, `HR`, `ADMIN`, `SUPER_ADMIN` |
| **Write Rate Limited** | Yes |

**Request Body**

| Field | Type | Required |
|---|---|---|
| `leave_type` | `string` | Yes |
| `start_date` | `string (YYYY-MM-DD)` | Yes |
| `end_date` | `string (YYYY-MM-DD)` | Yes |
| `reason` | `string` | Yes |

**Response 201**

```json
{
  "success": true,
  "data": { "id": "uuid", "status": "PENDING" },
  "message": "Leave request submitted"
}
```

| Error Code | Status | Description |
|---|---|---|
| `VALIDATION_FAILED` | 400 | end_date must be >= start_date |

---

## Courses & Learning

Base paths:
- `/api/v1/courses`
- `/api/v1/modules`
- `/api/v1/lessons`
- `/api/v1/enrollments`
- `/api/v1/quizzes`
- `/api/v1/assignments`
- `/api/v1/badges`
- `/api/v1/certificates`

---

### `GET /api/v1/courses`

Lists published courses. Supports search by title and category filter.

| Field | Value |
|---|---|
| **Auth Required** | Yes |
| **Allowed Roles** | All authenticated roles |
| **Query Params** | `category`, `search`, `page`, `limit` |

**Response 200**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Introduction to React",
      "description": "...",
      "category": "Technology",
      "duration_hours": 20,
      "is_published": true,
      "tutor_id": "uuid",
      "created_at": "2026-01-01T00:00:00.000Z"
    }
  ],
  "message": "Courses retrieved"
}
```

---

### `POST /api/v1/courses`

Creates a new course.

| Field | Value |
|---|---|
| **Auth Required** | Yes |
| **Allowed Roles** | `TUTOR`, `ADMIN`, `SUPER_ADMIN` |
| **Write Rate Limited** | Yes |

**Request Body**

| Field | Type | Required |
|---|---|---|
| `title` | `string` | Yes |
| `description` | `string` | Yes |
| `category` | `string` | Yes |
| `duration_hours` | `number` | Yes |
| `is_published` | `boolean` | No |

---

### `POST /api/v1/enrollments`

Enrolls the authenticated user in a course.

| Field | Value |
|---|---|
| **Auth Required** | Yes |
| **Allowed Roles** | `STUDENT`, `EMPLOYEE`, `INTERN`, `ADMIN`, `SUPER_ADMIN` |
| **Write Rate Limited** | Yes |

**Request Body**

| Field | Type | Required |
|---|---|---|
| `course_id` | `string (uuid)` | Yes |

**Response 201**

```json
{
  "success": true,
  "data": { "id": "uuid", "status": "ACTIVE" },
  "message": "Enrolled successfully"
}
```

| Error Code | Status | Description |
|---|---|---|
| `RESOURCE_CONFLICT` | 409 | Already enrolled |

---

## Payments

Base path: `/api/v1/payments`

---

### `GET /api/v1/payments`

Lists payment records. Supports date range and status filters.

| Field | Value |
|---|---|
| **Auth Required** | Yes |
| **Allowed Roles** | `SUPER_ADMIN`, `ADMIN`, `FINANCE` |
| **Query Params** | `status`, `start_date`, `end_date`, `method`, `page`, `limit` |

**Response 200**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "invoice_id": "uuid",
      "amount": 1500.00,
      "method": "CARD",
      "status": "COMPLETED",
      "paid_at": "2026-01-01T00:00:00.000Z",
      "transaction_ref": "TXN-001"
    }
  ],
  "message": "Payments retrieved"
}
```

---

### `POST /api/v1/payments`

Records a new payment manually.

| Field | Value |
|---|---|
| **Auth Required** | Yes |
| **Allowed Roles** | `SUPER_ADMIN`, `ADMIN`, `FINANCE` |
| **Write Rate Limited** | Yes |

**Request Body**

| Field | Type | Required |
|---|---|---|
| `invoice_id` | `string (uuid)` | Yes |
| `amount` | `number` | Yes |
| `method` | `string` | Yes — one of `PAYMENT_METHOD` |
| `status` | `string` | Yes — one of `PAYMENT_STATUS` |
| `transaction_ref` | `string` | No |

---

### `POST /api/v1/payments/webhook/razorpay`

Razorpay payment webhook endpoint. Authenticated via API key.

| Field | Value |
|---|---|
| **Auth Required** | Yes — `X-API-Key` header |
| **Rate Limited** | Yes — 50 req/min |
| **Content-Type** | `application/json` (raw Razorpay webhook payload) |

**Response 200**

```json
{
  "success": true,
  "message": "Webhook processed"
}
```

---

### `POST /api/v1/payments/webhook/stripe`

Stripe payment webhook endpoint. Authenticated via API key.

| Field | Value |
|---|---|
| **Auth Required** | Yes — `X-API-Key` header |

---

## Invoices

Base path: `/api/v1/invoices`

---

### `GET /api/v1/invoices`

Lists invoices for the tenant.

| Field | Value |
|---|---|
| **Auth Required** | Yes |
| **Allowed Roles** | `SUPER_ADMIN`, `ADMIN`, `FINANCE` |
| **Query Params** | `status`, `client_id`, `page`, `limit` |

**Response 200**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "invoice_number": "INV-001",
      "client_id": "uuid",
      "subtotal": 1000.00,
      "tax": 180.00,
      "total": 1180.00,
      "status": "PAID",
      "due_date": "2026-02-01",
      "created_at": "2026-01-01T00:00:00.000Z"
    }
  ],
  "message": "Invoices retrieved"
}
```

| Error Code | Status | Description |
|---|---|---|
| `RESOURCE_NOT_FOUND` | 404 | Invoice not found |

---

## Subscriptions

Base path: `/api/v1/subscriptions`

---

### `GET /api/v1/subscriptions`

Lists active subscriptions.

| Field | Value |
|---|---|
| **Auth Required** | Yes |
| **Allowed Roles** | `ADMIN`, `SUPER_ADMIN`, `FINANCE` |

---

### `POST /api/v1/subscriptions`

Creates a subscription for a client.

| Field | Value |
|---|---|
| **Auth Required** | Yes |
| **Allowed Roles** | `ADMIN`, `SUPER_ADMIN` |
| **Write Rate Limited** | Yes |

**Request Body**

| Field | Type | Required |
|---|---|---|
| `client_id` | `string (uuid)` | Yes |
| `plan_id` | `string` | Yes |
| `start_date` | `string (YYYY-MM-DD)` | Yes |
| `billing_cycle` | `string` | Yes — one of `RECURRING_FREQUENCY` |
| `amount` | `number` | Yes |

**Response 201**

```json
{
  "success": true,
  "data": { "id": "uuid", "status": "ACTIVE" },
  "message": "Subscription created"
}
```

---

## Tasks

Base path: `/api/v1/tasks`

---

### `GET /api/v1/tasks`

Lists tasks assigned to or created by the authenticated user.

| Field | Value |
|---|---|
| **Auth Required** | Yes |
| **Allowed Roles** | All authenticated roles |
| **Query Params** | `status`, `priority`, `assigned_to`, `page`, `limit` |

**Response 200**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Fix login bug",
      "description": "...",
      "status": "IN_PROGRESS",
      "priority": "HIGH",
      "assigned_to": "uuid",
      "due_date": "2026-01-20",
      "created_by": "uuid"
    }
  ],
  "message": "Tasks retrieved"
}
```

---

### `POST /api/v1/tasks`

Creates a task.

| Field | Value |
|---|---|
| **Auth Required** | Yes |
| **Allowed Roles** | All authenticated roles |
| **Write Rate Limited** | Yes |

**Request Body**

| Field | Type | Required |
|---|---|---|
| `title` | `string` | Yes |
| `description` | `string` | No |
| `priority` | `string` | No — `LOW`, `MEDIUM`, `HIGH`, `URGENT` |
| `assigned_to` | `string (uuid)` | No |
| `due_date` | `string (YYYY-MM-DD)` | No |

**Response 201**

```json
{
  "success": true,
  "data": { "id": "uuid" },
  "message": "Task created successfully"
}
```

---

## Payroll

Base path: `/api/v1/payroll`

---

### `GET /api/v1/payroll`

Lists payroll records.

| Field | Value |
|---|---|
| **Auth Required** | Yes |
| **Allowed Roles** | `SUPER_ADMIN`, `ADMIN`, `FINANCE`, `HR` |
| **Query Params** | `month`, `year`, `user_id`, `status`, `page`, `limit` |

**Response 200**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "month": 1,
      "year": 2026,
      "basic_salary": 50000.00,
      "deductions": 5000.00,
      "net_salary": 45000.00,
      "status": "PAID",
      "paid_at": "2026-02-01T00:00:00.000Z"
    }
  ],
  "message": "Payroll records retrieved"
}
```

---

## Performance

Base path: `/api/v1/performance`

---

### `GET /api/v1/performance`

Lists performance review records.

| Field | Value |
|---|---|
| **Auth Required** | Yes |
| **Allowed Roles** | `HR`, `EMPLOYEE`, `ADMIN`, `SUPER_ADMIN` |
| **Query Params** | `user_id`, `review_period`, `page`, `limit` |

**Response 200**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "review_period": "2026-Q1",
      "rating": 4,
      "feedback": "Excellent work...",
      "reviewed_by": "uuid",
      "created_at": "2026-04-01T00:00:00.000Z"
    }
  ],
  "message": "Performance reviews retrieved"
}
```

---

### `POST /api/v1/performance`

Submits a performance review.

| Field | Value |
|---|---|
| **Auth Required** | Yes |
| **Allowed Roles** | `HR`, `ADMIN`, `SUPER_ADMIN` |
| **Write Rate Limited** | Yes |

**Request Body**

| Field | Type | Required |
|---|---|---|
| `user_id` | `string (uuid)` | Yes |
| `review_period` | `string` | Yes |
| `rating` | `number` | Yes — 1 to 5 |
| `feedback` | `string` | Yes |

---

## Calendar & Holidays

Base paths: `/api/v1/calendar`, `/api/v1/holidays`

---

### `GET /api/v1/calendar`

Lists calendar events for the authenticated user's organization.

| Field | Value |
|---|---|
| **Auth Required** | Yes |
| **Allowed Roles** | All authenticated roles |
| **Query Params** | `start_date`, `end_date`, `type` |

**Response 200**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Team Meeting",
      "type": "MEETING",
      "start": "2026-01-15T10:00:00.000Z",
      "end": "2026-01-15T11:00:00.000Z",
      "created_by": "uuid"
    }
  ],
  "message": "Calendar events retrieved"
}
```

---

### `GET /api/v1/holidays`

Lists public holidays for the current year.

| Field | Value |
|---|---|
| **Auth Required** | Yes |
| **Allowed Roles** | All authenticated roles |

**Response 200**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "New Year",
      "date": "2026-01-01",
      "type": "PUBLIC"
    }
  ],
  "message": "Holidays retrieved"
}
```

---

## Workflows & Approvals

Base paths: `/api/v1/workflows`, `/api/v1/approvals`

---

### `GET /api/v1/approvals`

Lists pending approvals for the authenticated user.

| Field | Value |
|---|---|
| **Auth Required** | Yes |
| **Allowed Roles** | All authenticated roles |
| **Query Params** | `status` (`PENDING`, `APPROVED`, `REJECTED`) |

**Response 200**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "LEAVE",
      "reference_id": "uuid",
      "status": "PENDING",
      "requested_by": "uuid",
      "requested_at": "2026-01-01T00:00:00.000Z"
    }
  ],
  "message": "Approvals retrieved"
}
```

---

### `POST /api/v1/approvals/:id/approve`

Approves a pending approval request.

| Field | Value |
|---|---|
| **Auth Required** | Yes |
| **Allowed Roles** | `ADMIN`, `SUPER_ADMIN`, role-specific approvers |

**Request Body**

| Field | Type | Required | Description |
|---|---|---|---|
| `comments` | `string` | No | Approval notes |

**Response 200**

```json
{
  "success": true,
  "data": { "id": "uuid", "status": "APPROVED" },
  "message": "Approval granted"
}
```

| Error Code | Status | Description |
|---|---|---|
| `INSUFFICIENT_PERMISSIONS` | 403 | Not authorized to approve this request |

---

## Communication & Notifications

Base paths: `/api/v1/communications`, `/api/v1/notifications`

---

### `GET /api/v1/notifications`

Lists notifications for the authenticated user.

| Field | Value |
|---|---|
| **Auth Required** | Yes |
| **Allowed Roles** | All authenticated roles |
| **Query Params** | `is_read` (`true`, `false`) |

**Response 200**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "title": "New Lead Assigned",
      "body": "You have been assigned a new lead.",
      "type": "INFO",
      "is_read": false,
      "created_at": "2026-01-01T00:00:00.000Z"
    }
  ],
  "message": "Notifications retrieved"
}
```

---

### `POST /api/v1/communications`

Sends a communication (email or SMS) to a recipient.

| Field | Value |
|---|---|
| **Auth Required** | Yes |
| **Allowed Roles** | `ADMIN`, `HR`, `RECEPTION`, `SUPER_ADMIN` |
| **Write Rate Limited** | Yes |

**Request Body**

| Field | Type | Required |
|---|---|---|
| `recipient_id` | `string (uuid)` | Yes |
| `channel` | `string` | Yes — `EMAIL` or `SMS` |
| `subject` | `string` | No |
| `body` | `string` | Yes |

---

## Integrations & Webhooks

Base paths: `/api/v1/integrations`, `/api/v1/webhooks`

---

### `GET /api/v1/integrations`

Lists configured integrations.

| Field | Value |
|---|---|
| **Auth Required** | Yes |
| **Allowed Roles** | `SUPER_ADMIN`, `ADMIN` |

**Response 200**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Razorpay",
      "type": "PAYMENT_GATEWAY",
      "is_active": true,
      "config": { "key_id": "***" },
      "created_at": "2026-01-01T00:00:00.000Z"
    }
  ],
  "message": "Integrations retrieved"
}
```

---

### `POST /api/v1/webhooks`

Registers a new outgoing webhook.

| Field | Value |
|---|---|
| **Auth Required** | Yes |
| **Allowed Roles** | `ADMIN`, `SUPER_ADMIN` |
| **Write Rate Limited** | Yes |

**Request Body**

| Field | Type | Required |
|---|---|---|
| `url` | `string (URL)` | Yes |
| `events` | `string[]` | Yes |
| `secret` | `string` | No |

**Response 201**

```json
{
  "success": true,
  "data": { "id": "uuid" },
  "message": "Webhook registered"
}
```

---

## Reports & Analytics

Base paths: `/api/v1/reports`, `/api/v1/scheduled-reports`

---

### `GET /api/v1/reports`

Generates a report. The `type` query parameter selects the report.

| Field | Value |
|---|---|
| **Auth Required** | Yes |
| **Allowed Roles** | `ADMIN`, `SUPER_ADMIN`, `FINANCE`, `HR` |
| **Query Params** | `type` (required), `start_date`, `end_date`, `format` (`json`, `csv`) |

**Supported Report Types**

| `type` | Description |
|---|---|
| `revenue` | Revenue summary by date range |
| `attendance` | Attendance report per employee |
| `leads` | Lead conversion funnel |
| `payroll` | Payroll disbursement summary |

**Response 200**

```json
{
  "success": true,
  "data": {
    "type": "revenue",
    "generated_at": "2026-01-01T00:00:00.000Z",
    "rows": [
      { "date": "2026-01-01", "total": 5000.00, "count": 10 }
    ]
  },
  "message": "Report generated"
}
```

---

## Tenant & Marketplace

Base paths: `/api/v1/tenants`, `/api/v1/marketplace`, `/api/v1/cart`, `/api/v1/coupons`, `/api/v1/orders`

---

### `GET /api/v1/marketplace`

Lists marketplace items available for purchase.

| Field | Value |
|---|---|
| **Auth Required** | Yes |
| **Allowed Roles** | All authenticated roles |
| **Query Params** | `category`, `search`, `page`, `limit` |

**Response 200**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Advanced React Course",
      "description": "...",
      "price": 99.99,
      "category": "COURSE",
      "is_active": true,
      "created_at": "2026-01-01T00:00:00.000Z"
    }
  ],
  "message": "Marketplace items retrieved"
}
```

---

### `POST /api/v1/cart`

Adds an item to the authenticated user's cart.

| Field | Value |
|---|---|
| **Auth Required** | Yes |
| **Allowed Roles** | All authenticated roles |
| **Write Rate Limited** | Yes |

**Request Body**

| Field | Type | Required |
|---|---|---|
| `item_id` | `string (uuid)` | Yes |
| `quantity` | `number` | No — default 1 |

---

### `POST /api/v1/orders`

Places an order from the cart.

| Field | Value |
|---|---|
| **Auth Required** | Yes |
| **Allowed Roles** | All authenticated roles |
| **Write Rate Limited** | Yes |

**Request Body**

```json
{
  "coupon_code": "WELCOME10"
}
```

**Response 201**

```json
{
  "success": true,
  "data": { "id": "uuid", "status": "PENDING" },
  "message": "Order placed successfully"
}
```

---

## Error Codes Reference

| Code | HTTP Status | Description |
|---|---|---|
| `APP_ERROR` | Various | Generic application error |
| `VALIDATION_FAILED` | 400 | Request body or query parameter validation failed |
| `AUTHENTICATION_REQUIRED` | 401 | Missing or invalid authentication |
| `SESSION_EXPIRED` | 401 | Session token has expired |
| `INSUFFICIENT_PERMISSIONS` | 403 | Authenticated but not authorized |
| `RESOURCE_NOT_FOUND` | 404 | Requested resource does not exist |
| `RESOURCE_CONFLICT` | 409 | Duplicate or conflicting resource (e.g. duplicate email) |
| `RATE_LIMIT_EXCEEDED` | 429 | Rate limit threshold exceeded |
| `INTERNAL_ERROR` | 500 | Unhandled server error |

---

## Standard Response Envelope

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully",
  "meta": { ... }
}
```

- `data` is `null` for operations that return no body (e.g. DELETE).
- `meta` is included only when `res.locals.meta` is set by the route handler (e.g. pagination info).

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": { ... }
}
```

- `details` is present only when the error carries additional context (e.g. validation error field list).
- In production, `stack` traces are omitted from error logs and responses.

---

## Response Headers

| Header | Value | On Every Response |
|---|---|---|
| `X-Request-ID` | Unique request identifier | Yes |
| `X-API-Version` | API version used (e.g. `v1`) | Yes |
| `X-RateLimit-Limit` | Max requests in current window | Yes (on `/api/*`) |
| `X-RateLimit-Remaining` | Requests remaining in window | Yes (on `/api/*`) |
| `X-RateLimit-Reset` | Unix timestamp when window resets | Yes (on `/api/*`) |
| `Retry-After` | Seconds until rate limit resets | Only when 429 is returned |

---

## Authentication Schemes

### Session Cookie (Browser Clients)

1. `POST /api/v1/auth/login` with `email` and `password`.
2. Server sets an `HttpOnly` `session_token` cookie.
3. Subsequent requests include this cookie automatically.

### API Key (Service-to-Service)

1. Include `X-API-Key: <key>` or `Authorization: Bearer <key>` header.
2. Key is validated against the `api_keys` table.
3. `req.apiKey` is populated with the key's scopes and tenant context.

---

## Notes

- All route paths shown above are relative to the server root. Health endpoints are at `/health`, not under `/api`.
- Pagination defaults: `page=1`, `limit=20`. Max `limit=100`.
- Dates in request bodies: `YYYY-MM-DD`. Date-times: ISO 8601 (`2026-01-01T00:00:00.000Z`).
- Soft deletes are used throughout. Deleted records have `deleted_at` set and are excluded from list queries.
- Tenant context is resolved by the `resolveTenant` middleware applied globally to `/api` routes.
- Source code is organized under `backend/src/` with controllers, routes, models, services, and middleware.
- Configuration and environment setup: see `backend/.env.example` and `backend/README.md`.
- Database migrations and schema extensions live in `backend/src/migrations/` and `backend/schema.sql`.
