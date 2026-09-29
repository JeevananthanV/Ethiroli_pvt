import React from 'react';
import AdminPage from '../../../common/components/AdminPage';

export default function PMReports() {
  const reports = [
    { title: 'Sprint Velocity & Burndown', desc: 'Analyzes story points completed vs planned across sprints', date: 'Generated today', metric: '94% On Track' },
    { title: 'Project Budget vs Actual Hours', desc: 'Commercial billable hours logged against contract quotes', date: 'This Month', metric: '₹4.2L / ₹5.0L' },
    { title: 'Team Utilization & Efficiency', desc: 'Resource load balance, overtime, and capacity allocations', date: 'Last 30 Days', metric: '88% Optimal' },
    { title: 'Client Milestone Sign-offs', desc: 'Audit of completed milestones awaiting client sign-off', date: 'Pending', metric: '3 Pending' },
  ];

  return (
    <AdminPage
      title="Project Performance Reports"
      subtitle="Analytics on sprint velocity, deliverable milestones, and budget burn rates"
    >
      <div className="row g-3 mb-2">
        {reports.map((r, i) => (
          <div key={i} className="col-md-6">
            <div className="card border-0 shadow-sm rounded-3 p-3 h-100 bg-white">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h5 className="fw-bold mb-0 text-dark">{r.title}</h5>
                <span className="badge bg-primary bg-opacity-10 text-primary">{r.metric}</span>
              </div>
              <p className="text-muted small mb-2">{r.desc}</p>
              <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
                <small className="text-muted"><i className="bi bi-clock me-1"></i>{r.date}</small>
                <button className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1">
                  <i className="bi bi-download"></i>
                  <span>Download CSV</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminPage>
  );
}
