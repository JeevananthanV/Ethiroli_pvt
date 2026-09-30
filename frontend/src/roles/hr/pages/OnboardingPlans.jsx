import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import Button from '../../../common/components/Button/Button.jsx';
import Modal from '../../../common/components/Modal/Modal.jsx';

const DEFAULT_PLANS = [
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

export default function HROnboardingPlans() {
  const [plans, setPlans] = useState(DEFAULT_PLANS);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const [newPlan, setNewPlan] = useState({
    name: '',
    role_type: 'INTERN',
    duration_days: 30,
    target_role: ''
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const filteredPlans = plans.filter(p => {
    if (roleFilter === 'ALL') return true;
    return p.role_type === roleFilter;
  });

  const handleCreatePlan = (e) => {
    e.preventDefault();
    const created = {
      id: `plan-${newPlan.role_type.toLowerCase()}-${Date.now()}`,
      name: newPlan.name,
      role_type: newPlan.role_type,
      duration_days: Number(newPlan.duration_days),
      target_role: newPlan.target_role,
      phases: [
        {
          phaseName: 'Phase 1 – Induction & Setup',
          days: `Day 1–${Math.round(newPlan.duration_days * 0.15)}`,
          tasks: [
            { task: 'HR Induction & Welcome Briefing', assignee: 'HR Lead', verified: false },
            { task: 'Workstation & Account Setup', assignee: 'IT Support', verified: false }
          ]
        },
        {
          phaseName: 'Phase 2 – Core Training & Projects',
          days: `Day ${Math.round(newPlan.duration_days * 0.15) + 1}–${Math.round(newPlan.duration_days * 0.8)}`,
          tasks: [
            { task: 'Role Specific SOPs & Live Projects', assignee: 'Supervisor', verified: false }
          ]
        },
        {
          phaseName: 'Phase 3 – Final Review & Milestone',
          days: `Day ${Math.round(newPlan.duration_days * 0.8) + 1}–${newPlan.duration_days}`,
          tasks: [
            { task: 'Final Evaluation & Milestone Review', assignee: 'HR & Management', verified: false }
          ]
        }
      ]
    };
    setPlans([created, ...plans]);
    setShowCreateModal(false);
    showToast(`Onboarding Plan "${newPlan.name}" created successfully!`);
    setNewPlan({ name: '', role_type: 'INTERN', duration_days: 30, target_role: '' });
  };

  return (
    <AdminPage
      title="Configurable Onboarding Plans"
      subtitle="Structured 15, 30, 45, 60 & 90-day phase-driven plans for new employees and interns"
      actions={
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <i className="bi bi-plus-circle me-1" /> Create Custom Plan
        </Button>
      }
    >
      <div className="dashboard">
        {toastMsg && (
          <div style={{
            background: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            fontWeight: 500
          }}>
            <i className="bi bi-check-circle-fill text-success me-2" />
            {toastMsg}
          </div>
        )}

        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem' }}>
          {['ALL', 'INTERN', 'EMPLOYEE'].map((r) => (
            <button
              key={r}
              className={`btn btn-sm ${roleFilter === r ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setRoleFilter(r)}
            >
              {r === 'ALL' ? 'All Onboarding Plans' : `${r} Plans`}
            </button>
          ))}
        </div>

        {/* Plan Cards Grid */}
        <div className="row g-4">
          {filteredPlans.map((plan) => (
            <div className="col-md-6" key={plan.id}>
              <div className="card h-100" style={{ border: '1px solid #e2e8f0', borderRadius: '0.75rem' }}>
                <div className="cardHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className={`badge ${plan.role_type === 'INTERN' ? 'bg-info text-dark' : 'bg-primary'} mb-2`}>
                      {plan.role_type} • {plan.duration_days} DAYS
                    </span>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{plan.name}</h4>
                    <small className="text-muted">{plan.target_role}</small>
                  </div>
                </div>
                <div className="cardBody">
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.75rem' }}>
                    Phases & Milestones ({plan.phases.length} Phases):
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {plan.phases.map((ph, idx) => (
                      <div key={idx} style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: '6px', fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                          <span>{ph.phaseName}</span>
                          <span className="badge bg-light text-dark border">{ph.days}</span>
                        </div>
                        <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '2px' }}>
                          {ph.tasks.length} structured checklist tasks
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="cardFooter" style={{ background: '#ffffff', borderTop: '1px solid #f1f5f9', padding: '0.75rem 1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => {
                      setSelectedPlan(plan);
                      setShowDetailModal(true);
                    }}
                  >
                    <i className="bi bi-eye me-1" /> View Full Plan Tasks
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View Plan Modal */}
        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title={selectedPlan?.name || 'Onboarding Plan'}
        >
          {selectedPlan && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="badge bg-primary">{selectedPlan.role_type}</span>
                <span className="badge bg-secondary font-monospace">{selectedPlan.duration_days} Days Plan</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {selectedPlan.phases.map((phase, pIdx) => (
                  <div key={pIdx} className="card" style={{ border: '1px solid #e2e8f0' }}>
                    <div className="cardHeader" style={{ background: '#f8fafc', padding: '0.6rem 1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong>{phase.phaseName}</strong>
                        <span className="badge bg-white text-dark border">{phase.days}</span>
                      </div>
                    </div>
                    <div className="cardBody" style={{ padding: '0.75rem 1rem' }}>
                      <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.875rem' }}>
                        {phase.tasks.map((taskItem, tIdx) => (
                          <li key={tIdx} style={{ marginBottom: '6px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>{taskItem.task}</span>
                              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Assigned: {taskItem.assignee}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-end">
                <button className="btn btn-secondary" onClick={() => setShowDetailModal(false)}>Close</button>
              </div>
            </div>
          )}
        </Modal>

        {/* Create Plan Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Configurable Onboarding Plan"
        >
          <form onSubmit={handleCreatePlan}>
            <div className="mb-3">
              <label className="form-label">Plan Name *</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. 45-Day QA Engineering Plan"
                value={newPlan.name}
                onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
              />
            </div>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label">Target Role Type *</label>
                <select
                  className="form-select"
                  value={newPlan.role_type}
                  onChange={(e) => setNewPlan({ ...newPlan, role_type: e.target.value })}
                >
                  <option value="INTERN">Intern</option>
                  <option value="EMPLOYEE">Employee</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Plan Duration (Days) *</label>
                <select
                  className="form-select"
                  value={newPlan.duration_days}
                  onChange={(e) => setNewPlan({ ...newPlan, duration_days: e.target.value })}
                >
                  <option value="15">15 Days (Short Intern)</option>
                  <option value="30">30 Days (Standard Intern / Emp)</option>
                  <option value="45">45 Days (Mid Intern)</option>
                  <option value="60">60 Days (Advanced Intern / Emp)</option>
                  <option value="90">90 Days (Full Employee Probation)</option>
                </select>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Target Role / Discipline</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Frontend Developer / UI Designer"
                value={newPlan.target_role}
                onChange={(e) => setNewPlan({ ...newPlan, target_role: e.target.value })}
              />
            </div>
            <div className="text-end mt-4">
              <button type="button" className="btn btn-secondary me-2" onClick={() => setShowCreateModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Plan</button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminPage>
  );
}
