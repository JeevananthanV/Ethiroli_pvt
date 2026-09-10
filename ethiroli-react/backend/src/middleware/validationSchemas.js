/**
 * Centralized validation schemas for all API entities.
 * Used by `validateBody(schema)` middleware in `src/middleware/validation.js`.
 *
 * Each schema supports:
 * - `required`: top-level required field names
 * - `fields`: per-field rules including type, required, email, phone, uuid, date, datetime, enum, minLength, maxLength, min, max
 */

export const schemas = {
  createUser: {
    required: ['email', 'password', 'full_name', 'role'],
    fields: {
      email: { type: 'string', required: true, email: true, maxLength: 255 },
      password: { type: 'string', required: true, minLength: 6, maxLength: 255 },
      full_name: { type: 'string', required: true, minLength: 2, maxLength: 255 },
      phone: { type: 'string', phone: true, maxLength: 20 },
      role: {
        type: 'string',
        required: true,
        enum: ['SUPER_ADMIN', 'ADMIN', 'HR', 'TUTOR', 'PROJECT_MANAGER', 'FINANCE', 'SALES', 'RECEPTION', 'EMPLOYEE', 'STUDENT', 'INTERN', 'CLIENT', 'VENDOR']
      },
      is_active: { type: 'boolean' }
    }
  },

  updateUser: {
    fields: {
      full_name: { type: 'string', minLength: 2, maxLength: 255 },
      phone: { type: 'string', phone: true, maxLength: 20 },
      role: { type: 'string', enum: ['SUPER_ADMIN', 'ADMIN', 'HR', 'TUTOR', 'PROJECT_MANAGER', 'FINANCE', 'SALES', 'RECEPTION', 'EMPLOYEE', 'STUDENT', 'INTERN', 'CLIENT', 'VENDOR'] },
      is_active: { type: 'boolean' }
    }
  },

  createLead: {
    required: ['name'],
    fields: {
      name: { type: 'string', required: true, minLength: 2, maxLength: 255 },
      email: { type: 'string', email: true, maxLength: 255 },
      phone: { type: 'string', phone: true, maxLength: 20 },
      source: { type: 'string', enum: ['WEBSITE', 'REFERRAL', 'SOCIAL_MEDIA', 'WALK_IN', 'PHONE', 'INDEED', 'OTHER'] },
      status: { type: 'string', enum: ['NEW', 'CONTACTED', 'DEMO', 'COUNSELLING', 'ADMISSION', 'PAYMENT', 'LOST'] },
      assigned_to: { type: 'string', uuid: true },
      notes: { type: 'string', maxLength: 5000 },
      follow_up_date: { type: 'string', date: true }
    }
  },

  createEmployee: {
    required: ['user_id', 'employee_code', 'department', 'designation', 'date_of_joining'],
    fields: {
      user_id: { type: 'string', required: true, uuid: true },
      employee_code: { type: 'string', required: true, maxLength: 50 },
      department: { type: 'string', required: true, maxLength: 100 },
      designation: { type: 'string', required: true, maxLength: 100 },
      date_of_joining: { type: 'string', required: true, date: true },
      pan: { type: 'string', maxLength: 255 },
      bank_account: { type: 'string', maxLength: 255 },
      pf_number: { type: 'string', maxLength: 255 }
    }
  },

  createIntern: {
    required: ['user_id', 'college_name', 'start_date', 'end_date'],
    fields: {
      user_id: { type: 'string', required: true, uuid: true },
      mentor_id: { type: 'string', uuid: true },
      college_name: { type: 'string', required: true, maxLength: 255 },
      stipend: { type: 'number', min: 0 },
      start_date: { type: 'string', required: true, date: true },
      end_date: { type: 'string', required: true, date: true }
    }
  },

  createCourse: {
    required: ['code', 'name', 'duration_days'],
    fields: {
      code: { type: 'string', required: true, maxLength: 50 },
      name: { type: 'string', required: true, maxLength: 255 },
      description: { type: 'string', maxLength: 5000 },
      duration_days: { type: 'number', required: true, min: 1 },
      fee: { type: 'number', min: 0 },
      tutor_id: { type: 'string', uuid: true },
      is_active: { type: 'boolean' }
    }
  },

  createModule: {
    required: ['course_id', 'title', 'module_order'],
    fields: {
      course_id: { type: 'string', required: true, uuid: true },
      title: { type: 'string', required: true, maxLength: 255 },
      module_order: { type: 'number', required: true, min: 1 }
    }
  },

  createLesson: {
    required: ['module_id', 'title', 'lesson_order'],
    fields: {
      module_id: { type: 'string', required: true, uuid: true },
      title: { type: 'string', required: true, maxLength: 255 },
      content: { type: 'string', maxLength: 50000 },
      video_url: { type: 'string', maxLength: 500 },
      lesson_order: { type: 'number', required: true, min: 1 }
    }
  },

  createQuiz: {
    required: ['course_id', 'title'],
    fields: {
      course_id: { type: 'string', required: true, uuid: true },
      title: { type: 'string', required: true, maxLength: 255 },
      description: { type: 'string', maxLength: 5000 },
      time_limit_minutes: { type: 'number', min: 1 },
      passing_score: { type: 'number', min: 0, max: 100 },
      is_published: { type: 'boolean' }
    }
  },

  createAssignment: {
    required: ['course_id', 'title', 'due_date'],
    fields: {
      course_id: { type: 'string', required: true, uuid: true },
      title: { type: 'string', required: true, maxLength: 255 },
      description: { type: 'string', maxLength: 5000 },
      due_date: { type: 'string', required: true, date: true },
      max_score: { type: 'number', min: 1 }
    }
  },

  createClient: {
    required: ['name'],
    fields: {
      name: { type: 'string', required: true, minLength: 2, maxLength: 255 },
      email: { type: 'string', email: true, maxLength: 255 },
      phone: { type: 'string', phone: true, maxLength: 20 },
      gst: { type: 'string', maxLength: 255 },
      address: { type: 'string', maxLength: 5000 },
      company_name: { type: 'string', maxLength: 255 }
    }
  },

  createSubscription: {
    required: ['client_id', 'service_name', 'monthly_fee', 'start_date', 'renewal_date'],
    fields: {
      client_id: { type: 'string', required: true, uuid: true },
      service_name: { type: 'string', required: true, maxLength: 255 },
      monthly_fee: { type: 'number', required: true, min: 0 },
      start_date: { type: 'string', required: true, date: true },
      renewal_date: { type: 'string', required: true, date: true },
      is_active: { type: 'boolean' }
    }
  },

  createTask: {
    required: ['subscription_id', 'description', 'due_date'],
    fields: {
      subscription_id: { type: 'string', required: true, uuid: true },
      description: { type: 'string', required: true, maxLength: 5000 },
      due_date: { type: 'string', required: true, date: true },
      status: { type: 'string', enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'] },
      assigned_to: { type: 'string', uuid: true }
    }
  },

  createInvoice: {
    required: ['invoice_number', 'client_id', 'issue_date', 'due_date', 'subtotal', 'total'],
    fields: {
      invoice_number: { type: 'string', required: true, maxLength: 50 },
      client_id: { type: 'string', uuid: true },
      student_id: { type: 'string', uuid: true },
      issue_date: { type: 'string', required: true, date: true },
      due_date: { type: 'string', required: true, date: true },
      subtotal: { type: 'number', required: true, min: 0 },
      gst_rate: { type: 'number', min: 0, max: 100 },
      gst_amount: { type: 'number', min: 0 },
      total: { type: 'number', required: true, min: 0 },
      status: { type: 'string', enum: ['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED'] },
      is_recurring: { type: 'boolean' },
      recurring_schedule_id: { type: 'string', uuid: true }
    }
  },

  createTransaction: {
    required: ['category', 'amount', 'date'],
    fields: {
      type: { type: 'string', enum: ['INCOME', 'EXPENSE'] },
      category: { type: 'string', required: true, maxLength: 100 },
      amount: { type: 'number', required: true, min: 0 },
      date: { type: 'string', required: true, date: true },
      description: { type: 'string', maxLength: 5000 },
      invoice_id: { type: 'string', uuid: true },
      gst_applicable: { type: 'boolean' },
      gst_amount: { type: 'number', min: 0 }
    }
  },

  createPayment: {
    required: ['invoice_id', 'amount', 'payment_date', 'method'],
    fields: {
      invoice_id: { type: 'string', required: true, uuid: true },
      amount: { type: 'number', required: true, min: 0 },
      payment_date: { type: 'string', required: true, date: true },
      method: { type: 'string', required: true, enum: ['RAZORPAY', 'STRIPE', 'BANK_TRANSFER', 'CASH', 'CHEQUE'] },
      reference_number: { type: 'string', maxLength: 100 },
      status: { type: 'string', enum: ['PENDING', 'SUCCESS', 'FAILED'] }
    }
  },

  createEvent: {
    required: ['title', 'event_type', 'start_time', 'end_time'],
    fields: {
      title: { type: 'string', required: true, maxLength: 255 },
      description: { type: 'string', maxLength: 5000 },
      event_type: { type: 'string', required: true, enum: ['MEETING', 'DEADLINE', 'TASK', 'ANNOUNCEMENT', 'TRAINING'] },
      start_time: { type: 'string', required: true, datetime: true },
      end_time: { type: 'string', required: true, datetime: true },
      is_all_day: { type: 'boolean' },
      location: { type: 'string', maxLength: 255 },
      meeting_link: { type: 'string', maxLength: 500 },
      assigned_users: { type: 'object' }
    }
  },

  createHoliday: {
    required: ['name', 'date'],
    fields: {
      name: { type: 'string', required: true, maxLength: 255 },
      date: { type: 'string', required: true, date: true },
      is_restricted: { type: 'boolean' },
      restricted_to: { type: 'object' }
    }
  },

  createWorkflow: {
    required: ['name', 'entity_type'],
    fields: {
      name: { type: 'string', required: true, maxLength: 255 },
      entity_type: { type: 'string', required: true, enum: ['LEAVE', 'INVOICE', 'HIRING', 'EXPENSE', 'PURCHASE'] },
      description: { type: 'string', maxLength: 5000 },
      is_active: { type: 'boolean' }
    }
  },

  createApprovalChain: {
    required: ['workflow_id', 'step_order', 'approver_role'],
    fields: {
      workflow_id: { type: 'string', required: true, uuid: true },
      step_order: { type: 'number', required: true, min: 1 },
      approver_role: { type: 'string', required: true, enum: ['HR', 'FINANCE', 'MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
      approval_condition: { type: 'object' }
    }
  },

  createJob: {
    required: ['title', 'description', 'created_by'],
    fields: {
      title: { type: 'string', required: true, maxLength: 255 },
      description: { type: 'string', required: true, maxLength: 10000 },
      department: { type: 'string', maxLength: 100 },
      location: { type: 'string', maxLength: 255 },
      salary_range: { type: 'string', maxLength: 100 },
      required_skills: { type: 'object' },
      status: { type: 'string', enum: ['DRAFT', 'OPEN', 'CLOSED', 'FILLED'] }
    }
  },

  createCandidate: {
    required: ['job_id', 'name', 'email'],
    fields: {
      job_id: { type: 'string', required: true, uuid: true },
      name: { type: 'string', required: true, maxLength: 255 },
      email: { type: 'string', required: true, email: true, maxLength: 255 },
      phone: { type: 'string', phone: true, maxLength: 20 },
      resume_url: { type: 'string', maxLength: 500 },
      source: { type: 'string', enum: ['INDEED', 'LINKEDIN', 'NAUKRI', 'REFERRAL', 'WEBSITE', 'MANUAL'] },
      status: { type: 'string', enum: ['NEW', 'CONTACTED', 'SCREENING', 'INTERVIEWING', 'OFFER', 'HIRED', 'REJECTED'] },
      notes: { type: 'string', maxLength: 5000 }
    }
  },

  createInterview: {
    required: ['candidate_id', 'round', 'scheduled_at'],
    fields: {
      candidate_id: { type: 'string', required: true, uuid: true },
      round: { type: 'string', required: true, enum: ['ROUND_1', 'ROUND_2', 'HR_ROUND'] },
      interviewer_id: { type: 'string', uuid: true },
      scheduled_at: { type: 'string', required: true, datetime: true },
      duration_minutes: { type: 'number', min: 15, max: 480 },
      meeting_link: { type: 'string', maxLength: 500 },
      feedback: { type: 'string', maxLength: 5000 },
      rating: { type: 'number', min: 0, max: 5 },
      status: { type: 'string', enum: ['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'] }
    }
  },

  createCompanySetting: {
    fields: {
      company_name: { type: 'string', maxLength: 255 },
      gst: { type: 'string', maxLength: 255 },
      pan: { type: 'string', maxLength: 255 },
      bank_name: { type: 'string', maxLength: 255 },
      bank_account: { type: 'string', maxLength: 255 },
      bank_ifsc: { type: 'string', maxLength: 50 },
      address: { type: 'string', maxLength: 5000 },
      logo_url: { type: 'string', maxLength: 500 },
      phone: { type: 'string', maxLength: 20 },
      email: { type: 'string', email: true, maxLength: 255 },
      currency: { type: 'string', maxLength: 10 }
    }
  },

  createCommunication: {
    required: ['channel', 'recipient', 'content'],
    fields: {
      channel: { type: 'string', required: true, enum: ['EMAIL', 'SMS', 'WHATSAPP'] },
      recipient: { type: 'string', required: true, maxLength: 255 },
      subject: { type: 'string', maxLength: 255 },
      content: { type: 'string', required: true, maxLength: 50000 },
      template_id: { type: 'string', uuid: true }
    }
  },

  createJobBoardPost: {
    required: ['job_id', 'platform'],
    fields: {
      job_id: { type: 'string', required: true, uuid: true },
      platform: { type: 'string', required: true, enum: ['LINKEDIN', 'NAUKRI', 'INDEED', 'INTERNSHALA'] },
      external_post_id: { type: 'string', maxLength: 255 },
      status: { type: 'string', enum: ['PENDING', 'POSTED', 'FAILED', 'EXPIRED'] }
    }
  },

  createPerformanceReview: {
    required: ['employee_id', 'review_date', 'rating'],
    fields: {
      employee_id: { type: 'string', required: true, uuid: true },
      review_date: { type: 'string', required: true, date: true },
      rating: { type: 'number', required: true, min: 0, max: 5 },
      feedback: { type: 'object' },
      overall_comment: { type: 'string', maxLength: 5000 },
      status: { type: 'string', enum: ['DRAFT', 'SUBMITTED', 'REVIEWED', 'COMPLETED'] }
    }
  },

  createStudentProject: {
    required: ['student_id', 'name', 'github_repo_url'],
    fields: {
      student_id: { type: 'string', required: true, uuid: true },
      name: { type: 'string', required: true, maxLength: 255 },
      description: { type: 'string', maxLength: 5000 },
      github_repo_url: { type: 'string', required: true, maxLength: 500 },
      repo_owner: { type: 'string', maxLength: 255 },
      repo_name: { type: 'string', maxLength: 255 },
      branch: { type: 'string', maxLength: 255 },
      is_active: { type: 'boolean' }
    }
  },

  createMindMapNode: {
    required: ['user_id', 'title'],
    fields: {
      user_id: { type: 'string', required: true, uuid: true },
      project_id: { type: 'string', uuid: true },
      parent_id: { type: 'string', uuid: true },
      title: { type: 'string', required: true, maxLength: 255 },
      content: { type: 'string', maxLength: 5000 },
      node_type: { type: 'string', enum: ['ROOT', 'BRANCH', 'LEAF'] },
      position_x: { type: 'number' },
      position_y: { type: 'number' },
      color: { type: 'string', maxLength: 20 },
      icon: { type: 'string', maxLength: 50 }
    }
  },

  createTenant: {
    required: ['name', 'subdomain'],
    fields: {
      name: { type: 'string', required: true, maxLength: 255 },
      subdomain: { type: 'string', required: true, maxLength: 100 },
      custom_domain: { type: 'string', maxLength: 255 },
      logo_url: { type: 'string', maxLength: 500 },
      primary_color: { type: 'string', maxLength: 20 },
      secondary_color: { type: 'string', maxLength: 20 },
      favicon_url: { type: 'string', maxLength: 500 },
      email_from: { type: 'string', email: true, maxLength: 255 },
      timezone: { type: 'string', maxLength: 100 },
      currency: { type: 'string', maxLength: 10 },
      is_active: { type: 'boolean' }
    }
  },

  createProduct: {
    required: ['tenant_id', 'course_id', 'price'],
    fields: {
      tenant_id: { type: 'string', required: true, uuid: true },
      course_id: { type: 'string', required: true, uuid: true },
      price: { type: 'number', required: true, min: 0 },
      discounted_price: { type: 'number', min: 0 },
      is_published: { type: 'boolean' },
      featured: { type: 'boolean' },
      seo_title: { type: 'string', maxLength: 255 },
      seo_description: { type: 'string', maxLength: 5000 }
    }
  },

  createCoupon: {
    required: ['tenant_id', 'code', 'discount_type', 'discount_value', 'valid_from', 'valid_to'],
    fields: {
      tenant_id: { type: 'string', required: true, uuid: true },
      code: { type: 'string', required: true, maxLength: 50 },
      discount_type: { type: 'string', required: true, enum: ['PERCENTAGE', 'FIXED'] },
      discount_value: { type: 'number', required: true, min: 0 },
      min_order_value: { type: 'number', min: 0 },
      max_discount_amount: { type: 'number', min: 0 },
      usage_limit: { type: 'number', min: 1 },
      valid_from: { type: 'string', required: true, date: true },
      valid_to: { type: 'string', required: true, date: true },
      is_active: { type: 'boolean' }
    }
  },

  createOrder: {
    required: ['order_number', 'subtotal', 'total', 'customer_name', 'customer_email'],
    fields: {
      order_number: { type: 'string', required: true, maxLength: 50 },
      subtotal: { type: 'number', required: true, min: 0 },
      discount_amount: { type: 'number', min: 0 },
      coupon_code: { type: 'string', maxLength: 50 },
      total: { type: 'number', required: true, min: 0 },
      payment_status: { type: 'string', enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'] },
      payment_method: { type: 'string', enum: ['RAZORPAY', 'STRIPE', 'BANK_TRANSFER'] },
      payment_id: { type: 'string', maxLength: 255 },
      billing_address: { type: 'object' },
      customer_name: { type: 'string', required: true, maxLength: 255 },
      customer_email: { type: 'string', required: true, email: true, maxLength: 255 },
      customer_phone: { type: 'string', phone: true, maxLength: 20 }
    }
  },

  createReportDefinition: {
    required: ['tenant_id', 'name', 'dimensions', 'metrics'],
    fields: {
      tenant_id: { type: 'string', required: true, uuid: true },
      name: { type: 'string', required: true, maxLength: 255 },
      description: { type: 'string', maxLength: 5000 },
      dimensions: { type: 'object', required: true },
      metrics: { type: 'object', required: true },
      filters: { type: 'object' },
      chart_type: { type: 'string', enum: ['TABLE', 'BAR', 'LINE', 'PIE', 'AREA'] }
    }
  },

  createApiKey: {
    required: ['tenant_id', 'name'],
    fields: {
      tenant_id: { type: 'string', required: true, uuid: true },
      name: { type: 'string', required: true, maxLength: 255 },
      scopes: { type: 'object' },
      rate_limit_per_minute: { type: 'number', min: 1 },
      expires_at: { type: 'string', datetime: true }
    }
  },

  createWebhook: {
    required: ['tenant_id', 'name', 'url', 'events'],
    fields: {
      tenant_id: { type: 'string', required: true, uuid: true },
      name: { type: 'string', required: true, maxLength: 255 },
      url: { type: 'string', required: true, maxLength: 500 },
      events: { type: 'array', required: true },
      secret: { type: 'string', maxLength: 255 },
      is_active: { type: 'boolean' }
    }
  },

  createLeave: {
    required: ['leave_type', 'start_date', 'end_date'],
    fields: {
      leave_type: { type: 'string', required: true, enum: ['CASUAL', 'SICK', 'EARNED'] },
      start_date: { type: 'string', required: true, date: true },
      end_date: { type: 'string', required: true, date: true },
      reason: { type: 'string', maxLength: 5000 }
    }
  },

  createAttendance: {
    fields: {
      check_in_time: { type: 'string', datetime: true },
      check_out_time: { type: 'string', datetime: true },
      status: { type: 'string', enum: ['PRESENT', 'ABSENT', 'HALF_DAY'] }
    }
  },

  createEnrollment: {
    required: ['course_id'],
    fields: {
      course_id: { type: 'string', required: true, uuid: true },
      student_id: { type: 'string', uuid: true },
      progress_percentage: { type: 'number', min: 0, max: 100 },
      status: { type: 'string', enum: ['ACTIVE', 'COMPLETED', 'DROPPED'] }
    }
  },

  updateEnrollmentProgress: {
    required: ['progress'],
    fields: {
      progress: { type: 'number', required: true, min: 0, max: 100 }
    }
  },

  createForumPost: {
    required: ['course_id', 'title', 'content'],
    fields: {
      course_id: { type: 'string', required: true, uuid: true },
      title: { type: 'string', required: true, maxLength: 255 },
      content: { type: 'string', required: true, maxLength: 50000 },
      is_pinned: { type: 'boolean' },
      is_locked: { type: 'boolean' }
    }
  },

  createForumReply: {
    required: ['post_id', 'content'],
    fields: {
      post_id: { type: 'string', required: true, uuid: true },
      content: { type: 'string', required: true, maxLength: 50000 },
      is_best_answer: { type: 'boolean' }
    }
  },

  createBadge: {
    required: ['name', 'criteria'],
    fields: {
      name: { type: 'string', required: true, maxLength: 100 },
      description: { type: 'string', maxLength: 5000 },
      icon: { type: 'string', maxLength: 255 },
      criteria: { type: 'object', required: true },
      is_active: { type: 'boolean' }
    }
  },

  createRecurringSchedule: {
    required: ['frequency', 'next_generation_date'],
    fields: {
      frequency: { type: 'string', required: true, enum: ['MONTHLY', 'QUARTERLY', 'YEARLY'] },
      next_generation_date: { type: 'string', required: true, date: true },
      client_id: { type: 'string', uuid: true },
      student_id: { type: 'string', uuid: true },
      is_active: { type: 'boolean' }
    }
  },

  createLiveQuizSession: {
    required: ['quiz_id'],
    fields: {
      quiz_id: { type: 'string', required: true, uuid: true },
      is_active: { type: 'boolean' }
    }
  },

  createIntegration: {
    required: ['service_name', 'category', 'config'],
    fields: {
      service_name: { type: 'string', required: true, maxLength: 100 },
      category: { type: 'string', required: true, enum: ['SECURITY', 'PAYMENTS', 'COMMUNICATION', 'CALENDAR', 'ANALYTICS', 'AUTOMATION', 'CRM', 'DEVTOOLS', 'JOBS'] },
      config: { type: 'object', required: true },
      is_enabled: { type: 'boolean' },
      connection_status: { type: 'string', enum: ['PENDING', 'CONNECTED', 'ERROR', 'DISABLED'] }
    }
  },

  createAutomationWorkflow: {
    required: ['tenant_id', 'name', 'trigger_type', 'trigger_config'],
    fields: {
      tenant_id: { type: 'string', required: true, uuid: true },
      name: { type: 'string', required: true, maxLength: 255 },
      description: { type: 'string', maxLength: 5000 },
      trigger_type: { type: 'string', required: true, enum: ['SCHEDULE', 'EVENT', 'WEBHOOK'] },
      trigger_config: { type: 'object', required: true },
      is_active: { type: 'boolean' }
    }
  },

  createDeviceRegistration: {
    required: ['user_id', 'tenant_id', 'device_id', 'platform', 'push_token'],
    fields: {
      user_id: { type: 'string', required: true, uuid: true },
      tenant_id: { type: 'string', required: true, uuid: true },
      device_id: { type: 'string', required: true, maxLength: 255 },
      platform: { type: 'string', required: true, enum: ['IOS', 'ANDROID', 'WEB'] },
      push_token: { type: 'string', required: true, maxLength: 255 },
      app_version: { type: 'string', maxLength: 50 },
      is_active: { type: 'boolean' }
    }
  },

  createStudentProject: {
    required: ['student_id', 'name', 'github_repo_url'],
    fields: {
      student_id: { type: 'string', required: true, uuid: true },
      name: { type: 'string', required: true, maxLength: 255 },
      description: { type: 'string', maxLength: 5000 },
      github_repo_url: { type: 'string', required: true, maxLength: 500 },
      repo_owner: { type: 'string', maxLength: 255 },
      repo_name: { type: 'string', maxLength: 255 },
      branch: { type: 'string', maxLength: 255 },
      is_active: { type: 'boolean' }
    }
  },

  createScheduledReport: {
    required: ['report_definition_id', 'tenant_id', 'frequency', 'recipient_emails', 'next_send_at'],
    fields: {
      report_definition_id: { type: 'string', required: true, uuid: true },
      tenant_id: { type: 'string', required: true, uuid: true },
      frequency: { type: 'string', required: true, enum: ['DAILY', 'WEEKLY', 'MONTHLY'] },
      format: { type: 'string', enum: ['PDF', 'CSV', 'EXCEL'] },
      recipient_emails: { type: 'array', required: true },
      next_send_at: { type: 'string', required: true, datetime: true },
      is_active: { type: 'boolean' }
    }
  },

  createCommunicationTemplate: {
    required: ['name', 'channel', 'body'],
    fields: {
      name: { type: 'string', required: true, maxLength: 100 },
      channel: { type: 'string', required: true, enum: ['EMAIL', 'SMS', 'WHATSAPP'] },
      subject: { type: 'string', maxLength: 255 },
      body: { type: 'string', required: true, maxLength: 50000 },
      variables: { type: 'object' },
      description: { type: 'string', maxLength: 5000 }
    }
  },

  createSalaryStructure: {
    required: ['employee_id', 'basic_salary', 'hra', 'effective_from'],
    fields: {
      employee_id: { type: 'string', required: true, uuid: true },
      basic_salary: { type: 'number', required: true, min: 0 },
      hra: { type: 'number', required: true, min: 0 },
      da: { type: 'number', min: 0 },
      pf_employee: { type: 'number', min: 0 },
      pf_employer: { type: 'number', min: 0 },
      esi_employee: { type: 'number', min: 0 },
      esi_employer: { type: 'number', min: 0 },
      tds: { type: 'number', min: 0 },
      effective_from: { type: 'string', required: true, date: true },
      effective_to: { type: 'string', date: true },
      is_active: { type: 'boolean' }
    }
  },

  processPayroll: {
    required: ['employee_id', 'month_year', 'basic', 'hra'],
    fields: {
      employee_id: { type: 'string', required: true, uuid: true },
      month_year: { type: 'string', required: true, maxLength: 7 },
      basic: { type: 'number', required: true, min: 0 },
      hra: { type: 'number', required: true, min: 0 },
      da: { type: 'number', min: 0 },
      pf_employee: { type: 'number', min: 0 },
      pf_employer: { type: 'number', min: 0 },
      esi_employee: { type: 'number', min: 0 },
      esi_employer: { type: 'number', min: 0 },
      tds: { type: 'number', min: 0 }
    }
  },

  runPayrollForAll: {
    required: ['month_year'],
    fields: {
      month_year: { type: 'string', required: true, maxLength: 7 }
    }
  },

  updateInvoiceStatus: {
    required: ['status'],
    fields: {
      status: { type: 'string', required: true, enum: ['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED'] }
    }
  },

  markPaid: {
    fields: {
      payment_method: { type: 'string', enum: ['RAZORPAY', 'STRIPE', 'BANK_TRANSFER', 'CASH', 'CHEQUE'] },
      reference_number: { type: 'string', maxLength: 100 },
      paid_at: { type: 'string', datetime: true }
    }
  },

  voidInvoice: {
    fields: {
      reason: { type: 'string', maxLength: 5000 }
    }
  },

  approveInstance: {
    fields: {
      comments: { type: 'string', maxLength: 5000 }
    }
  },

  rejectInstance: {
    required: ['reason'],
    fields: {
      reason: { type: 'string', required: true, maxLength: 5000 }
    }
  },

  createCertificate: {
    required: ['name'],
    fields: {
      name: { type: 'string', required: true, maxLength: 255 },
      description: { type: 'string', maxLength: 5000 },
      student_id: { type: 'string', uuid: true },
      course_id: { type: 'string', uuid: true },
      issue_date: { type: 'string', date: true },
      expiry_date: { type: 'string', date: true },
      certificate_url: { type: 'string', maxLength: 500 }
    }
  },

  updateLeadStatus: {
    required: ['status'],
    fields: {
      status: { type: 'string', required: true, enum: ['NEW', 'CONTACTED', 'DEMO', 'COUNSELLING', 'ADMISSION', 'PAYMENT', 'LOST'] }
    }
  },

  sendFollowUp: {
    required: ['message'],
    fields: {
      message: { type: 'string', required: true, maxLength: 5000 },
      follow_up_date: { type: 'string', date: true }
    }
  },

  updateLeaveStatus: {
    required: ['status'],
    fields: {
      status: { type: 'string', required: true, enum: ['PENDING', 'APPROVED', 'REJECTED'] }
    }
  },

  cancelLeave: {
    fields: {
      reason: { type: 'string', maxLength: 5000 }
    }
  },

  updateOrderStatus: {
    required: ['status'],
    fields: {
      status: { type: 'string', required: true, enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED', 'CANCELLED'] }
    }
  },

  updateTaskStatus: {
    required: ['status'],
    fields: {
      status: { type: 'string', required: true, enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED'] }
    }
  },

  bulkUpdateTasks: {
    required: ['task_ids', 'status'],
    fields: {
      task_ids: { type: 'array', required: true },
      status: { type: 'string', required: true, enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED'] }
    }
  },

  cancelSubscription: {
    fields: {
      reason: { type: 'string', maxLength: 5000 }
    }
  },

  pauseSubscription: {
    fields: {
      reason: { type: 'string', maxLength: 5000 }
    }
  },

  resumeSubscription: {
    fields: {
      effective_date: { type: 'string', date: true }
    }
  },

  reorderModules: {
    required: ['moduleIds'],
    fields: {
      moduleIds: { type: 'array', required: true }
    }
  },

  updateLesson: {
    fields: {
      title: { type: 'string', maxLength: 255 },
      content: { type: 'string', maxLength: 50000 },
      video_url: { type: 'string', maxLength: 500 },
      lesson_order: { type: 'number', min: 1 }
    }
  },

  updateQuiz: {
    fields: {
      title: { type: 'string', maxLength: 255 },
      description: { type: 'string', maxLength: 5000 },
      time_limit_minutes: { type: 'number', min: 1 },
      passing_score: { type: 'number', min: 0, max: 100 },
      is_published: { type: 'boolean' }
    }
  },

  joinLiveQuizSession: {
    required: ['session_id'],
    fields: {
      session_id: { type: 'string', required: true, uuid: true }
    }
  },

  submitAnswer: {
    required: ['question_id', 'answer'],
    fields: {
      question_id: { type: 'string', required: true, uuid: true },
      answer: { type: 'string', required: true, maxLength: 5000 }
    }
  },

  updateSystemConfig: {
    fields: {
      ALLOWED_ORIGINS: { type: 'array' }
    }
  }
};
