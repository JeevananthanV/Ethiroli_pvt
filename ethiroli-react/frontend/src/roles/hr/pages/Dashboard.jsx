import React from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function Dashboard() {
  return (
    <AdminPage title="HR Dashboard" subtitle="Human Resources management">
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card bg-primary text-white h-100">
            <div className="card-body">
              <h6 className="card-title">Employees</h6>
              <h2 className="card-text">312</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-info text-white h-100">
            <div className="card-body">
              <h6 className="card-title">Interns</h6>
              <h2 className="card-text">42</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white h-100">
            <div className="card-body">
              <h6 className="card-title">On Leave Today</h6>
              <h2 className="card-text">18</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="row g-3 mb-4">
        <div className="col-md-12">
          <div className="card h-100">
            <div className="card-header">
              <h6 className="mb-0">Quick Actions</h6>
            </div>
            <div className="card-body">
              <div className="d-flex gap-2 flex-wrap">
                <a href="/app/hr/attendance" className="btn btn-outline-primary">Attendance</a>
                <a href="/app/hr/leaves" className="btn btn-outline-success">Leaves</a>
                <a href="/app/hr/interviews" className="btn btn-outline-warning">Interviews</a>
                <a href="/app/hr/training" className="btn btn-outline-info">Training</a>
                <a href="/app/hr/performance" className="btn btn-outline-success">Performance</a>
                <a href="/app/hr/payroll" className="btn btn-outline-primary">Payroll</a>
                <a href="/app/hr/onboarding" className="btn btn-outline-secondary">Onboarding</a>
                <a href="/app/hr/documents" className="btn btn-outline-info">Documents</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">
              <h6 className="mb-0">Reports & Analytics</h6>
            </div>
            <div className="card-body">
              <ul className="list-unstyled mb-0">
                <li><a href="/app/hr/reports" className="text-decoration-none">HR Reports</a></li>
                <li><a href="/app/hr/announcements" className="text-decoration-none">Announcements</a></li>
                <li><a href="/app/hr/jobs-board" className="text-decoration-none">Jobs Board</a></li>
                <li><a href="/app/hr/offboarding" className="text-decoration-none">Exit / Offboarding</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">
              <h6 className="mb-0">Documents & Communications</h6>
            </div>
            <div className="card-body">
              <ul className="list-unstyled mb-0">
                <li><a href="/app/hr/documents" className="text-decoration-none">Documents</a></li>
                <li><a href="/app/hr/announcements" className="text-decoration-none">Announcements</a></li>
                <li><a href="/app/hr/exit-offboarding" className="text-decoration-none">Exit / Offboarding</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}