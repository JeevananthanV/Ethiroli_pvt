import React from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function AdminDashboard() {
  const domains = [
    { name: 'People Directory', icon: 'bi-people-fill', color: 'text-primary', bg: 'bg-primary', count: '142 Active', link: '/app/admin/users', desc: 'Users, Employees, Interns, Students, Tutors' },
    { name: 'Learning & LMS', icon: 'bi-book-fill', color: 'text-success', bg: 'bg-success', count: '18 Courses', link: '/app/admin/courses', desc: 'Curriculum, Batches, Student Enrollments' },
    { name: 'Projects & Tasks', icon: 'bi-kanban-fill', color: 'text-info', bg: 'bg-info', count: '24 Projects', link: '/app/admin/projects', desc: 'Milestones, Sprint Boards, Timesheets' },
    { name: 'HR Management', icon: 'bi-person-badge-fill', color: 'text-warning', bg: 'bg-warning', count: '96% Attendance', link: '/app/admin/attendance', desc: 'Leaves, Performance, Approvals' },
    { name: 'Sales & CRM', icon: 'bi-funnel-fill', color: 'text-danger', bg: 'bg-danger', count: '₹28.4L Pipeline', link: '/app/admin/leads', desc: 'Leads, Opportunities, Won Deals' },
    { name: 'Finance & Accounts', icon: 'bi-cash-coin', color: 'text-success', bg: 'bg-success', count: '₹14.2L MTD', link: '/app/admin/income', desc: 'Income, Expenses, Invoices, Payments' },
    { name: 'Campus Operations', icon: 'bi-calendar3', color: 'text-primary', bg: 'bg-primary', count: '8 Today', link: '/app/admin/calendar', desc: 'Calendar, Communications, Documents' },
    { name: 'Recruitment & Jobs', icon: 'bi-briefcase-fill', color: 'text-dark', bg: 'bg-dark', count: '6 Openings', link: '/app/admin/jobs-board', desc: 'Jobs Board, Candidate Pipelines' },
    { name: 'AI & Analytics', icon: 'bi-cpu-fill', color: 'text-info', bg: 'bg-info', count: 'Live Insights', link: '/app/admin/analytics', desc: 'Reporting, Cohort Analytics, Forecasts' },
    { name: 'Automation Studio', icon: 'bi-robot', color: 'text-warning', bg: 'bg-warning', count: '12 Active Rules', link: '/app/admin/automation', desc: 'Integrations, Developer API Portal' },
    { name: 'Marketplace & Rewards', icon: 'bi-trophy-fill', color: 'text-warning', bg: 'bg-warning', count: '32 Items', link: '/app/admin/marketplace', desc: 'Gamification Badges, App Add-ons' },
    { name: 'Security & Audit', icon: 'bi-shield-check', color: 'text-secondary', bg: 'bg-secondary', count: 'SOC2 Ready', link: '/app/admin/audit-logs', desc: 'Audit Logs, Organization Settings' }
  ];

  return (
    <AdminPage
      title="Admin Executive Command Center"
      subtitle="Comprehensive organization-wide control across People, Learning, Projects, HR, CRM, Finance, Operations, and Automation"
      actions={
        <div className="d-flex gap-2">
          <a href="/app/admin/reports" className="btn btn-outline-secondary btn-sm shadow-sm">
            <i className="bi bi-bar-chart-line me-1"></i> Executive Reports
          </a>
          <a href="/app/admin/settings" className="btn btn-primary btn-sm shadow-sm">
            <i className="bi bi-gear-fill me-1"></i> Org Settings
          </a>
        </div>
      }
    >
      {/* 6 Executive KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-2">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 border-start border-4 border-primary">
            <span className="text-secondary small fw-medium">Total People</span>
            <h3 className="fw-bold mb-0 mt-1">142</h3>
            <small className="text-muted">87 Staff • 55 Learners</small>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-2">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 border-start border-4 border-success">
            <span className="text-secondary small fw-medium">Active Batches</span>
            <h3 className="fw-bold mb-0 mt-1 text-success">18</h3>
            <small className="text-muted">4 Programs Running</small>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-2">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 border-start border-4 border-info">
            <span className="text-secondary small fw-medium">Client Projects</span>
            <h3 className="fw-bold mb-0 mt-1 text-info">24</h3>
            <small className="text-muted">98.2% On Track</small>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-2">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 border-start border-4 border-danger">
            <span className="text-secondary small fw-medium">Sales Pipeline</span>
            <h3 className="fw-bold mb-0 mt-1 text-danger">₹28.4L</h3>
            <small className="text-muted">14 Qualified Deals</small>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-2">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 border-start border-4 border-warning">
            <span className="text-secondary small fw-medium">Revenue (MTD)</span>
            <h3 className="fw-bold mb-0 mt-1 text-dark">₹14.2L</h3>
            <small className="text-success"><i className="bi bi-arrow-up-right me-1"></i>+18.4%</small>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-2">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 border-start border-4 border-dark">
            <span className="text-secondary small fw-medium">System Status</span>
            <h3 className="fw-bold mb-0 mt-1 text-success">99.98%</h3>
            <small className="text-muted">All Systems Normal</small>
          </div>
        </div>
      </div>

      {/* 12 Functional Domain Quick Hub */}
      <h6 className="fw-bold text-dark mb-3 text-uppercase small" style={{ letterSpacing: '0.05em' }}>
        Organization Operations Hub (12 Functional Domains)
      </h6>
      <div className="row g-3 mb-4">
        {domains.map((d, idx) => (
          <div className="col-12 col-md-6 col-xl-3" key={idx}>
            <a href={d.link} className="text-decoration-none">
              <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 hover-shadow transition">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className={`rounded-3 ${d.bg} bg-opacity-10 p-2 ${d.color}`}>
                    <i className={`bi ${d.icon} fs-5`}></i>
                  </div>
                  <span className="badge bg-light text-dark border font-monospace">{d.count}</span>
                </div>
                <h6 className="fw-bold text-dark mb-1">{d.name}</h6>
                <p className="text-secondary small mb-0">{d.desc}</p>
              </div>
            </a>
          </div>
        ))}
      </div>

      {/* Operational Pulse & Activity Feed */}
      <div className="row g-3">
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm rounded-3 p-4 bg-white h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold text-dark mb-0">
                <i className="bi bi-activity text-primary me-2"></i>Live Operational Pulse
              </h6>
              <span className="badge bg-success bg-opacity-10 text-success">Organization Healthy</span>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0 small">
                <thead className="table-light">
                  <tr>
                    <th>Domain</th>
                    <th>Recent Milestone / Event</th>
                    <th>Responsible Lead</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span className="badge bg-primary bg-opacity-10 text-primary">Learning</span></td>
                    <td>New Batch FSWD-2026-B02 Launched (28 Trainees)</td>
                    <td>Karthikeyan S</td>
                    <td><span className="text-success"><i className="bi bi-check-circle-fill me-1"></i>Active</span></td>
                  </tr>
                  <tr>
                    <td><span className="badge bg-danger bg-opacity-10 text-danger">Sales & CRM</span></td>
                    <td>Infosys BPM Enterprise Training Proposal Accepted (₹8.5L)</td>
                    <td>Ravi Kumar</td>
                    <td><span className="text-success"><i className="bi bi-check-circle-fill me-1"></i>Won</span></td>
                  </tr>
                  <tr>
                    <td><span className="badge bg-info bg-opacity-10 text-info">Projects</span></td>
                    <td>Sprint 14 Delivery for MedHealth AI Completed</td>
                    <td>Arun Prakash</td>
                    <td><span className="text-primary"><i className="bi bi-arrow-right-circle me-1"></i>In Review</span></td>
                  </tr>
                  <tr>
                    <td><span className="badge bg-warning bg-opacity-10 text-warning">HR & Staff</span></td>
                    <td>Monthly Payroll Runs Verified & Approved</td>
                    <td>Priya Mohan</td>
                    <td><span className="text-success"><i className="bi bi-check-circle-fill me-1"></i>Cleared</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm rounded-3 p-4 bg-white h-100">
            <h6 className="fw-bold text-dark mb-3">
              <i className="bi bi-lightning-charge-fill text-warning me-2"></i>Quick Administrative Actions
            </h6>
            <div className="d-flex flex-column gap-2">
              <a href="/app/admin/users" className="btn btn-light text-start border d-flex align-items-center justify-content-between p-2">
                <span><i className="bi bi-person-plus me-2 text-primary"></i>Provision New User</span>
                <i className="bi bi-chevron-right text-muted small"></i>
              </a>
              <a href="/app/admin/batches" className="btn btn-light text-start border d-flex align-items-center justify-content-between p-2">
                <span><i className="bi bi-plus-square me-2 text-success"></i>Create Academic Batch</span>
                <i className="bi bi-chevron-right text-muted small"></i>
              </a>
              <a href="/app/admin/invoices" className="btn btn-light text-start border d-flex align-items-center justify-content-between p-2">
                <span><i className="bi bi-receipt me-2 text-info"></i>Generate Client Invoice</span>
                <i className="bi bi-chevron-right text-muted small"></i>
              </a>
              <a href="/app/admin/approvals" className="btn btn-light text-start border d-flex align-items-center justify-content-between p-2">
                <span><i className="bi bi-patch-check me-2 text-warning"></i>Pending Approvals (4)</span>
                <i className="bi bi-chevron-right text-muted small"></i>
              </a>
              <a href="/app/admin/settings" className="btn btn-light text-start border d-flex align-items-center justify-content-between p-2">
                <span><i className="bi bi-sliders me-2 text-secondary"></i>Configure Organization</span>
                <i className="bi bi-chevron-right text-muted small"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}