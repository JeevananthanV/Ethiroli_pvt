export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  HR: 'HR',
  TUTOR: 'TUTOR',
  PROJECT_MANAGER: 'PROJECT_MANAGER',
  FINANCE: 'FINANCE',
  SALES: 'SALES',
  RECEPTION: 'RECEPTION',
  EMPLOYEE: 'EMPLOYEE',
  STUDENT: 'STUDENT',
  INTERN: 'INTERN',
  CLIENT: 'CLIENT',
  VENDOR: 'VENDOR'
};

export const LEAD_STATUS = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  DEMO: 'DEMO',
  COUNSELLING: 'COUNSELLING',
  ADMISSION: 'ADMISSION',
  PAYMENT: 'PAYMENT',
  LOST: 'LOST'
};

export const LEAVE_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED'
};

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED'
};

export const INVOICE_STATUS = {
  DRAFT: 'DRAFT',
  SENT: 'SENT',
  PAID: 'PAID',
  OVERDUE: 'OVERDUE',
  CANCELLED: 'CANCELLED'
};

export const ATTENDANCE_STATUS = {
  PRESENT: 'PRESENT',
  ABSENT: 'ABSENT',
  HALF_DAY: 'HALF_DAY',
  LEAVE: 'LEAVE'
};

export const GENDER = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER'
};

export const EMPLOYMENT_TYPE = {
  FULL_TIME: 'FULL_TIME',
  PART_TIME: 'PART_TIME',
  CONTRACT: 'CONTRACT',
  INTERN: 'INTERN'
};

export const PAYMENT_METHOD = {
  CASH: 'CASH',
  CARD: 'CARD',
  UPI: 'UPI',
  BANK_TRANSFER: 'BANK_TRANSFER',
  CHEQUE: 'CHEQUE',
  ONLINE: 'ONLINE'
};

export const QUERY_STATUS = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED'
};

export const APPROVAL_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

export const RECURRING_FREQUENCY = {
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY',
  YEARLY: 'YEARLY'
};

export const CACHE_TTL = {
  SHORT: 60,
  MEDIUM: 300,
  LONG: 3600
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500
};

export const ERROR_MESSAGES = {
  INTERNAL_ERROR: 'Internal server error',
  NOT_FOUND: 'Resource not found',
  VALIDATION_FAILED: 'Validation failed',
  AUTHENTICATION_REQUIRED: 'Authentication required',
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',
  RESOURCE_CONFLICT: 'Resource conflict',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded',
  SESSION_EXPIRED: 'Session expired. Please log in again.',
  USER_NOT_FOUND: 'User not found',
  EMAIL_ALREADY_EXISTS: 'User with this email already exists',
  INVALID_CREDENTIALS: 'Invalid email or password',
  RESOURCE_NOT_FOUND: 'Resource not found',
  OPERATION_FAILED: 'Operation failed',
  REQUIRED_FIELD_MISSING: 'Required field missing',
  ACCOUNT_DEACTIVATED: 'User account is deactivated.'
};

export const SUCCESS_MESSAGES = {
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  RETRIEVED: 'Resource retrieved successfully',
  OPERATION_SUCCESS: 'Operation completed successfully',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logged out successfully'
};

export const PORTAL_CONFIGS = {
  SUPER_ADMIN: {
    slug: 'super-admin',
    strategies: ['password'],
    mfaRequired: true,
    oauthProviders: [],
    sessionDuration: 4 * 60 * 60,
    cookiePath: '/app/super-admin'
  },
  ADMIN: {
    slug: 'admin',
    strategies: ['password'],
    mfaRequired: true,
    oauthProviders: [],
    sessionDuration: 8 * 60 * 60,
    cookiePath: '/app/admin'
  },
  HR: {
    slug: 'hr',
    strategies: ['password'],
    mfaRequired: false,
    oauthProviders: [],
    sessionDuration: 8 * 60 * 60,
    cookiePath: '/app/hr'
  },
  TUTOR: {
    slug: 'tutor',
    strategies: ['password'],
    mfaRequired: false,
    oauthProviders: [],
    sessionDuration: 8 * 60 * 60,
    cookiePath: '/app/tutor'
  },
  PROJECT_MANAGER: {
    slug: 'pm',
    strategies: ['password'],
    mfaRequired: false,
    oauthProviders: [],
    sessionDuration: 8 * 60 * 60,
    cookiePath: '/app/pm'
  },
  FINANCE: {
    slug: 'finance',
    strategies: ['password'],
    mfaRequired: false,
    oauthProviders: [],
    sessionDuration: 8 * 60 * 60,
    cookiePath: '/app/finance'
  },
  SALES: {
    slug: 'sales',
    strategies: ['password'],
    mfaRequired: false,
    oauthProviders: [],
    sessionDuration: 8 * 60 * 60,
    cookiePath: '/app/sales'
  },
  RECEPTION: {
    slug: 'reception',
    strategies: ['password'],
    mfaRequired: false,
    oauthProviders: [],
    sessionDuration: 8 * 60 * 60,
    cookiePath: '/app/reception'
  },
  EMPLOYEE: {
    slug: 'employee',
    strategies: ['password'],
    mfaRequired: false,
    oauthProviders: [],
    sessionDuration: 8 * 60 * 60,
    cookiePath: '/app/employee'
  },
  STUDENT: {
    slug: 'student',
    strategies: ['password'],
    mfaRequired: false,
    oauthProviders: [],
    sessionDuration: 24 * 60 * 60,
    cookiePath: '/app/student'
  },
  INTERN: {
    slug: 'intern',
    strategies: ['password'],
    mfaRequired: false,
    oauthProviders: [],
    sessionDuration: 24 * 60 * 60,
    cookiePath: '/app/intern'
  },
  CLIENT: {
    slug: 'client',
    strategies: ['password'],
    mfaRequired: false,
    oauthProviders: [],
    sessionDuration: 24 * 60 * 60,
    cookiePath: '/app/client'
  },
  VENDOR: {
    slug: 'vendor',
    strategies: ['password'],
    mfaRequired: false,
    oauthProviders: [],
    sessionDuration: 24 * 60 * 60,
    cookiePath: '/app/vendor'
  }
};

export const getPortalConfigBySlug = (slug) => {
  const entry = Object.entries(PORTAL_CONFIGS).find(([, config]) => config.slug === slug);
  return entry ? { role: entry[0], ...entry[1] } : null;
};

export const getPortalConfigByRole = (role) => {
  return PORTAL_CONFIGS[role] || null;
};

export const ROLE_PERMISSIONS = {
  SUPER_ADMIN: ['*'],
  ADMIN: ['*'],
  HR: [
    'employees:read', 'employees:write',
    'interns:read', 'interns:write',
    'attendance:read', 'attendance:write',
    'leaves:read', 'leaves:write',
    'courses:read', 'courses:write',
    'modules:read', 'modules:write',
    'lessons:read', 'lessons:write',
    'enrollments:read', 'enrollments:write',
    'quizzes:read', 'quizzes:write',
    'assignments:read', 'assignments:write',
    'interviews:read', 'interviews:write',
    'payroll:read',
    'performance:read', 'performance:write',
    'calendar:read', 'calendar:write',
    'holidays:read', 'holidays:write',
    'approvals:read', 'approvals:write'
  ],
  TUTOR: [
    'courses:read', 'courses:write',
    'modules:read', 'modules:write',
    'lessons:read', 'lessons:write',
    'enrollments:read', 'enrollments:write',
    'quizzes:read', 'quizzes:write',
    'assignments:read', 'assignments:write',
    'forum:read', 'forum:write',
    'badges:read',
    'certificates:read',
    'calendar:read', 'calendar:write'
  ],
  PROJECT_MANAGER: [
    'clients:read', 'clients:write',
    'subscriptions:read', 'subscriptions:write',
    'tasks:read', 'tasks:write',
    'invoices:read', 'invoices:write',
    'company_settings:read', 'company_settings:write',
    'calendar:read', 'calendar:write',
    'approvals:read', 'approvals:write'
  ],
  FINANCE: [
    'invoices:read', 'invoices:write',
    'payments:read', 'payments:write',
    'transactions:read', 'transactions:write',
    'payroll:read', 'payroll:write',
    'reports:read', 'reports:write',
    'calendar:read', 'calendar:write'
  ],
  SALES: [
    'leads:read', 'leads:write',
    'clients:read',
    'calendar:read', 'calendar:write'
  ],
  RECEPTION: [
    'attendance:read', 'attendance:write',
    'leaves:read',
    'calendar:read', 'calendar:write',
    'communications:read', 'communications:write'
  ],
  EMPLOYEE: [
    'attendance:read', 'attendance:write',
    'leaves:read', 'leaves:write',
    'tasks:read',
    'performance:read',
    'calendar:read', 'calendar:write',
    'approvals:read', 'approvals:write',
    'payslips:read'
  ],
  STUDENT: [
    'courses:read',
    'enrollments:read', 'enrollments:write',
    'quizzes:read', 'quizzes:write',
    'assignments:read', 'assignments:write',
    'forum:read', 'forum:write',
    'badges:read',
    'certificates:read',
    'calendar:read', 'calendar:write',
    'projects:read', 'projects:write',
    'mindmaps:read', 'mindmaps:write'
  ],
  INTERN: [
    'attendance:read', 'attendance:write',
    'leaves:read', 'leaves:write',
    'tasks:read', 'tasks:write',
    'calendar:read', 'calendar:write',
    'projects:read', 'projects:write'
  ]
};

export const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || process.env.FRONTEND_ORIGIN)
  ? (process.env.ALLOWED_ORIGINS || process.env.FRONTEND_ORIGIN).split(',').map(o => o.trim()).filter(Boolean)
  : [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5000',
      'http://localhost:5173'
    ];
