import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { candidateApi } from '../../../services/api/candidateApi';
import { enrollmentApi } from '../../../services/api/enrollmentApi';
import { workflowApi } from '../../../services/api/workflowApi';
import Button from '../../../common/components/Button';

export default function Dashboard() {
  const [visitors, setVisitors] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [visitorsData, enrollmentsData, workflowsData] = await Promise.all([
        candidateApi.getAll().catch(() => []),
        enrollmentApi.getAll().catch(() => []),
        workflowApi.getAll().catch(() => []),
      ]);
      setVisitors(visitorsData);
      setEnrollments(enrollmentsData);
      setWorkflows(workflowsData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <AdminPage title="Reception Dashboard" subtitle="Monitor visitors, admissions, and communications">
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white h-100">
            <div className="card-body">
              <h6 className="card-title">Today's Visitors</h6>
              <h2 className="card-text">{visitors.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white h-100">
            <div className="card-body">
              <h6 className="card-title">Check-ins</h6>
              <h2 className="card-text">{visitors.filter((v) => v.status === 'active' || v.status === 'checked-in').length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-dark h-100">
            <div className="card-body">
              <h6 className="card-title">Pending Appointments</h6>
              <h2 className="card-text">{workflows.filter((w) => w.status === 'pending').length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white h-100">
            <div className="card-body">
              <h6 className="card-title">Enrollments</h6>
              <h2 className="card-text">{enrollments.length}</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="row g-3 mb-4">
        <div className="col-md-12">
          <div className="card h-100">
            <div className="card-header">
              <h6 className="mb-0">Reception Operations</h6>
            </div>
            <div className="card-body">
              <div className="d-flex gap-2 flex-wrap">
                <a href="/app/reception/visitors" className="btn btn-outline-primary">Visitors</a>
                <a href="/app/reception/enquiries" className="btn btn-outline-info">Enquiries</a>
                <a href="/app/reception/admissions" className="btn btn-outline-success">Admissions</a>
                <a href="/app/reception/registration" className="btn btn-outline-warning">Registration</a>
                <a href="/app/reception/payments" className="btn btn-outline-secondary">Payments</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">
              <h6 className="mb-0">Recent Visitors</h6>
            </div>
            <div className="card-body">
              {visitors.length === 0 ? (
                <p className="text-muted">No visitors today</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="table table-sm">
                    <thead>
                      <tr><th>Name</th><th>Email</th><th>Check-in Time</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {visitors.slice(0, 5).map((visitor) => (
                        <tr key={visitor.id}>
                          <td style={{ fontWeight: 500 }}>{visitor.name}</td>
                          <td className="text-secondary">{visitor.email}</td>
                          <td className="text-secondary">{visitor.createdAt ? new Date(visitor.createdAt).toLocaleString() : '-'}</td>
                          <td>
                            <span className={`statusTag ${visitor.status === 'active' || visitor.status === 'checked-in' ? 'active' : 'pending'}`}>
                              {visitor.status || 'pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">
              <h6 className="mb-0">Quick Actions</h6>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="/app/reception/registration" className="btn btn-secondary w-100">Register New Visitor</a>
              <a href="/app/reception/calendar" className="btn btn-secondary w-100">View Today's Schedule</a>
              <a href="/app/reception/communications" className="btn btn-secondary w-100">Send Notification</a>
              <a href="/app/reception/payments" className="btn btn-secondary w-100">Generate Report</a>
            </div>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}