import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { useAuth } from '../../../common/contexts/AuthContext.jsx';
import { Link } from 'react-router-dom';

/**
 * InternHead - Cohort management view for the designated Head of Interns.
 * Provides cohort overview, team progress, and cross-intern monitoring.
 */
export default function InternHead() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  return (
    <AdminPage
      title="Head of Interns · Cohort Management"
      subtitle="Cohort-wide oversight, daily attendance monitoring, and task delivery tracking"
      loading={loading}
    >
      <div className="container-fluid px-0">
        {/* KPI Summary Cards */}
        <div className="row g-3 mb-3">
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-primary border-4">
              <small className="text-muted text-uppercase fw-semibold">Active Cohort</small>
              <h3 className="mb-0 fw-bold mt-1 text-primary">7</h3>
              <small className="text-muted">Enrolled Interns</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-success border-4">
              <small className="text-muted text-uppercase fw-semibold">Today's Attendance</small>
              <h3 className="mb-0 fw-bold mt-1 text-success">100%</h3>
              <small className="text-muted">7/7 Punched In</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-warning border-4">
              <small className="text-muted text-uppercase fw-semibold">Milestones Due</small>
              <h3 className="mb-0 fw-bold mt-1 text-warning">3</h3>
              <small className="text-muted">This week</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-info border-4">
              <small className="text-muted text-uppercase fw-semibold">Avg. Progress</small>
              <h3 className="mb-0 fw-bold mt-1 text-info">68%</h3>
              <small className="text-muted">Curriculum Pace</small>
            </div>
          </div>
        </div>

        {/* Cohort Roster Table */}
        <div className="card border-0 shadow-sm rounded-3">
          <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h6 className="mb-0 fw-bold">Intern Roster & Status</h6>
            <div className="d-flex gap-2">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search intern..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ maxWidth: '200px' }}
              />
              <Link to="/app/intern/dashboard" className="btn btn-sm btn-outline-primary">
                My Dashboard
              </Link>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-muted small text-uppercase">
                <tr>
                  <th>Intern</th>
                  <th>College</th>
                  <th>Track</th>
                  <th>Attendance</th>
                  <th>Progress</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold" style={{ width: '36px', height: '36px' }}>
                        N
                      </div>
                      <div>
                        <strong className="text-dark d-block">Nandhini K</strong>
                        <small className="text-muted">knandhinivnr@gmail.com</small>
                      </div>
                    </div>
                  </td>
                  <td>Anna University</td>
                  <td><span className="badge bg-light text-dark border">Full Stack Web</span></td>
                  <td><span className="badge bg-success bg-opacity-10 text-success">Active · Clocked In</span></td>
                  <td>
                    <div className="d-flex align-items-center gap-2" style={{ minWidth: '120px' }}>
                      <div className="progress flex-grow-1" style={{ height: '6px' }}>
                        <div className="progress-bar bg-primary" style={{ width: '75%' }}></div>
                      </div>
                      <small className="text-muted">75%</small>
                    </div>
                  </td>
                  <td>
                    <Link to="/app/intern/tasks" className="btn btn-sm btn-light border">
                      View Tasks
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="rounded-circle bg-success bg-opacity-10 text-success d-flex align-items-center justify-content-center fw-bold" style={{ width: '36px', height: '36px' }}>
                        M
                      </div>
                      <div>
                        <strong className="text-dark d-block">Mathishree</strong>
                        <small className="text-muted">mathishree008@gmail.com</small>
                      </div>
                    </div>
                  </td>
                  <td>PSG College of Technology</td>
                  <td><span className="badge bg-light text-dark border">Full Stack Web</span></td>
                  <td><span className="badge bg-success bg-opacity-10 text-success">Active · Clocked In</span></td>
                  <td>
                    <div className="d-flex align-items-center gap-2" style={{ minWidth: '120px' }}>
                      <div className="progress flex-grow-1" style={{ height: '6px' }}>
                        <div className="progress-bar bg-success" style={{ width: '70%' }}></div>
                      </div>
                      <small className="text-muted">70%</small>
                    </div>
                  </td>
                  <td>
                    <Link to="/app/intern/tasks" className="btn btn-sm btn-light border">
                      View Tasks
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
