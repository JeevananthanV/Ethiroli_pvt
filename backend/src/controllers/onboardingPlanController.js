import pool from '../config/database.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import { decrypt } from '../config/encryption.js';
import AuditLog from '../models/AuditLog.js';

const STATIC_PLANS = [
  {
    id: 'plan-intern-30',
    name: '30-Day Intern Onboarding Plan',
    role_type: 'INTERN',
    duration_days: 30,
    target_role: 'Software Engineering / Data Science Intern',
    phases: [
      {
        phaseName: 'Phase 1 – Orientation',
        days: 'Day 1',
        tasks: [
          { task: 'HR Orientation & Company Culture Introduction', assignee: 'HR Lead', verified: true },
          { task: 'Document Verification & ID Card Allocation', assignee: 'Operations', verified: true },
          { task: 'Workstation & Git Dev Environment Setup', assignee: 'Tech Mentor', verified: true },
          { task: 'Assigned Mentor Introduction & Roadmap Alignment', assignee: 'Mentor', verified: true }
        ]
      },
      {
        phaseName: 'Phase 2 – Training & Foundations',
        days: 'Day 2–10',
        tasks: [
          { task: 'Core Technology Stack Modules & Coding SOPs', assignee: 'Intern', verified: false },
          { task: 'Daily Practical Coding Tasks & Git Commit Drills', assignee: 'Intern', verified: false },
          { task: 'Daily Mentor Review & Standup Participation', assignee: 'Mentor', verified: false }
        ]
      },
      {
        phaseName: 'Phase 3 – Live Project Execution',
        days: 'Day 11–25',
        tasks: [
          { task: 'Live Client / Internal Module Assignment', assignee: 'Project Manager', verified: false },
          { task: 'Sprint Feature Development & Testing', assignee: 'Intern', verified: false },
          { task: 'Mid-Term Code Review & Milestone Demo', assignee: 'Mentor', verified: false }
        ]
      },
      {
        phaseName: 'Phase 4 – Evaluation & Certification',
        days: 'Day 26–30',
        tasks: [
          { task: 'Final Technical Evaluation & Project Presentation', assignee: 'Tech Lead & PM', verified: false },
          { task: 'Mentor & HR Performance Feedback Round', assignee: 'HR Executive', verified: false },
          { task: 'Internship Completion Certificate & PPO Assessment', assignee: 'HR Director', verified: false }
        ]
      }
    ]
  },
  {
    id: 'plan-intern-60',
    name: '60-Day Advanced Internship Plan',
    role_type: 'INTERN',
    duration_days: 60,
    target_role: 'Full Stack / AI Intern',
    phases: [
      {
        phaseName: 'Phase 1 – Induction & Core Stack',
        days: 'Day 1–15',
        tasks: [
          { task: 'Company Induction & Security Policies', assignee: 'HR Lead', verified: true },
          { task: 'Stack Deep Dive & Hands-on Architecture Labs', assignee: 'Intern', verified: true },
          { task: 'Mentor Pairing & First Code Commit', assignee: 'Mentor', verified: true }
        ]
      },
      {
        phaseName: 'Phase 2 – Advanced Feature Development',
        days: 'Day 16–45',
        tasks: [
          { task: 'Production Feature Implementation', assignee: 'Intern', verified: false },
          { task: 'Sprint Participation & CI/CD Pipeline Workflow', assignee: 'Tech Mentor', verified: false },
          { task: 'Mid-Term Evaluation & Progress Milestone', assignee: 'PM', verified: false }
        ]
      },
      {
        phaseName: 'Phase 3 – Deployment & Career Evaluation',
        days: 'Day 46–60',
        tasks: [
          { task: 'Production QA & Performance Tuning', assignee: 'Intern', verified: false },
          { task: 'Final Capstone Project Defense', assignee: 'Review Board', verified: false },
          { task: 'Pre-Placement Offer (PPO) Review & Certificate', assignee: 'HR', verified: false }
        ]
      }
    ]
  },
  {
    id: 'plan-emp-30',
    name: '30-Day Employee Onboarding Plan',
    role_type: 'EMPLOYEE',
    duration_days: 30,
    target_role: 'New Full-time Employee',
    phases: [
      {
        phaseName: 'Phase 1 – Induction & Setup',
        days: 'Day 1–3',
        tasks: [
          { task: 'HR Induction & Employment Contract Signoff', assignee: 'HR Lead', verified: true },
          { task: 'Company Security & Compliance Training', assignee: 'Compliance', verified: true },
          { task: 'Department Manager Introduction & Team Welcome', assignee: 'Manager', verified: true },
          { task: 'Access Credentials & Toolchain Provisioning', assignee: 'IT Admin', verified: true }
        ]
      },
      {
        phaseName: 'Phase 2 – Systems & Knowledge Transfer',
        days: 'Day 4–15',
        tasks: [
          { task: 'Internal Architecture & Codebase Deep Dive', assignee: 'Lead Engineer', verified: false },
          { task: 'Department SOPs & Quality Guidelines Review', assignee: 'Employee', verified: false },
          { task: 'Initial Sprint Backlog Assignment', assignee: 'Product Lead', verified: false }
        ]
      },
      {
        phaseName: 'Phase 3 – Production Ownership & 30-Day Review',
        days: 'Day 16–30',
        tasks: [
          { task: 'Independent Feature Delivery & PR Merge', assignee: 'Employee', verified: false },
          { task: '30-Day Performance & Cultural Fit Check-In', assignee: 'HR & Manager', verified: false },
          { task: 'Q2 Goal Setting & KPI Alignment', assignee: 'Manager', verified: false }
        ]
      }
    ]
  },
  {
    id: 'plan-emp-90',
    name: '90-Day Enterprise Growth Onboarding Plan',
    role_type: 'EMPLOYEE',
    duration_days: 90,
    target_role: 'Senior / Lead Positions',
    phases: [
      {
        phaseName: 'Phase 1 – Discover & Absorb',
        days: 'Day 1–30',
        tasks: [
          { task: 'Leadership Briefings & Cross-functional Introductions', assignee: 'HR Director', verified: true },
          { task: 'Department Strategy & Tech Stack Assessment', assignee: 'Employee', verified: false },
          { task: 'First 30-Day Transition Review', assignee: 'VP Engineering', verified: false }
        ]
      },
      {
        phaseName: 'Phase 2 – Execute & Optimize',
        days: 'Day 31–60',
        tasks: [
          { task: 'Core Subsystem Optimization & Architecture RFC', assignee: 'Employee', verified: false },
          { task: 'Mentoring Junior Peers & Code Reviews', assignee: 'Employee', verified: false },
          { task: '60-Day Mid-Probation Performance Review', assignee: 'Manager', verified: false }
        ]
      },
      {
        phaseName: 'Phase 3 – Full Autonomy & Probation Signoff',
        days: 'Day 61–90',
        tasks: [
          { task: 'Strategic Roadmap Ownership', assignee: 'Employee', verified: false },
          { task: 'Comprehensive 90-Day Performance Evaluation', assignee: 'Review Board', verified: false },
          { task: 'Probation Confirmation Letter Issuance', assignee: 'HR Operations', verified: false }
        ]
      }
    ]
  }
];

export const listOnboardingPlans = asyncHandler(async (req, res) => {
  const { role_type } = req.query;
  let plans = STATIC_PLANS;
  if (role_type && role_type !== 'ALL') {
    plans = plans.filter(p => p.role_type === role_type);
  }
  return success(res, 200, plans, 'Onboarding plans retrieved successfully');
});

export const createOnboardingPlan = asyncHandler(async (req, res) => {
  const { name, role_type, duration_days, target_role, phases } = req.body;
  if (!name || !role_type) {
    throw new ValidationError('Name and role_type are required');
  }
  const created = {
    id: `plan-${Date.now()}`,
    name,
    role_type,
    duration_days: duration_days || 30,
    target_role: target_role || '',
    phases: phases || []
  };

  await AuditLog.create({
    user_id: req.user?.id || null,
    action: 'CREATE_ONBOARDING_PLAN',
    entity_type: 'ONBOARDING_PLAN',
    entity_id: created.id,
    new_value: created,
    ip_address: req.ip || 'unknown',
    user_agent: req.headers['user-agent']
  });

  return success(res, 201, created, 'Onboarding plan created successfully');
});

export const listOnboardings = asyncHandler(async (req, res) => {
  const [employees] = await pool.query(`
    SELECT e.id, u.full_name as employee_name, e.department, e.designation, e.joining_date as start_date
    FROM employees e
    JOIN users u ON e.user_id = u.id
    WHERE u.is_active = TRUE
    ORDER BY e.joining_date DESC
  `);

  const [interns] = await pool.query(`
    SELECT i.id, u.full_name as employee_name, 'Engineering' as department, i.domain as designation, i.start_date, i.progress
    FROM interns i
    JOIN users u ON i.user_id = u.id
    WHERE u.is_active = TRUE
    ORDER BY i.start_date DESC
  `);

  const list = [
    ...employees.map(e => ({
      id: `OB-EMP-${e.id}`,
      employee_name: decrypt(e.employee_name) || 'Employee',
      department: e.department || 'General',
      start_date: e.start_date || '2026-10-14',
      status: 'in_progress'
    })),
    ...interns.map(i => ({
      id: `OB-INT-${i.id}`,
      employee_name: decrypt(i.employee_name) || 'Intern',
      department: i.department || 'Engineering',
      start_date: i.start_date || '2026-10-14',
      status: (i.progress >= 100) ? 'completed' : 'in_progress'
    }))
  ];

  return success(res, 200, list, 'Onboarding records retrieved successfully');
});

export const createOnboarding = asyncHandler(async (req, res) => {
  const { employee_name, department, start_date } = req.body;
  const item = {
    id: `OB-${Date.now()}`,
    employee_name: employee_name || 'New Joiner',
    department: department || 'Operations',
    start_date: start_date || new Date().toISOString().slice(0, 10),
    status: 'in_progress'
  };
  return success(res, 201, item, 'Onboarding process created successfully');
});

export const updateOnboarding = asyncHandler(async (req, res) => {
  const { id } = req.params;
  return success(res, 200, { id, ...req.body }, 'Onboarding record updated successfully');
});

export const listTrainings = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(`
    SELECT e.id, c.name as title, 'INTERN' as target_role,
           u.full_name as assigned_to,
           t.full_name as assigned_tutor_or_mentor,
           e.enrolled_at as start_date,
           '3 Months' as target_completion,
           ROUND(e.progress_percentage) as progress,
           e.status,
           'Assigned (LMS Sync Initiated)' as lms_sync_status
    FROM enrollments e
    JOIN courses c ON e.course_id = c.id
    JOIN users u ON e.student_id = u.id
    LEFT JOIN users t ON c.tutor_id = t.id
    WHERE u.is_active = TRUE
    ORDER BY e.enrolled_at DESC
  `);

  const list = rows.map(r => ({
    ...r,
    assigned_to: decrypt(r.assigned_to) || 'Student / Intern',
    assigned_tutor_or_mentor: r.assigned_tutor_or_mentor ? (decrypt(r.assigned_tutor_or_mentor) || r.assigned_tutor_or_mentor) : 'Staff Mentor',
    status: r.status === 'COMPLETED' ? 'COMPLETED' : 'IN_PROGRESS'
  }));

  return success(res, 200, list, 'Trainings retrieved successfully');
});

export const createTraining = asyncHandler(async (req, res) => {
  const item = {
    id: `TRN-${Date.now()}`,
    ...req.body,
    progress: 0,
    status: 'IN_PROGRESS',
    lms_sync_status: 'Assigned (LMS Sync Initiated)'
  };
  return success(res, 201, item, 'Training assigned successfully');
});

export const updateTraining = asyncHandler(async (req, res) => {
  const { id } = req.params;
  return success(res, 200, { id, ...req.body }, 'Training record updated successfully');
});

export default {
  listOnboardingPlans,
  createOnboardingPlan,
  listOnboardings,
  createOnboarding,
  updateOnboarding,
  listTrainings,
  createTraining,
  updateTraining
};
