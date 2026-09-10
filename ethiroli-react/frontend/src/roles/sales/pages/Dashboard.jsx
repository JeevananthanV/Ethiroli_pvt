import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { candidateApi } from '../../../services/api/candidateApi';
import { interviewApi } from '../../../services/api/interviewApi';
import Button from '../../../common/components/Button';

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [leadsData, interviewsData] = await Promise.all([
        candidateApi.getAll().catch(() => []),
        interviewApi.getAll().catch(() => []),
      ]);
      setLeads(leadsData);
      setInterviews(interviewsData);
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
    <AdminPage title="Sales Dashboard" subtitle="Track leads, pipeline, and conversion metrics">
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white h-100">
            <div className="card-body">
              <h6 className="card-title">Total Leads</h6>
              <h2 className="card-text">{leads.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white h-100">
            <div className="card-body">
              <h6 className="card-title">Converted</h6>
              <h2 className="card-text">{leads.filter((l) => l.status === 'converted' || l.status === 'qualified').length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-dark h-100">
            <div className="card-body">
              <h6 className="card-title">Interviews</h6>
              <h2 className="card-text">{interviews.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white h-100">
            <div className="card-body">
              <h6 className="card-title">New Leads</h6>
              <h2 className="card-text">{leads.filter((l) => l.status === 'new').length}</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="row g-3 mb-4">
        <div className="col-md-12">
          <div className="card h-100">
            <div className="card-header">
              <h6 className="mb-0">CRM & Sales Pipeline</h6>
            </div>
            <div className="card-body">
              <div className="d-flex gap-2 flex-wrap">
                <a href="/app/sales/contacts" className="btn btn-outline-primary">CRM Contacts</a>
                <a href="/app/sales/opportunities" className="btn btn-outline-success">Opportunities</a>
                <a href="/app/sales/deals" className="btn btn-outline-info">Deals</a>
                <a href="/app/sales/proposals" className="btn btn-outline-warning">Proposals / Quotes</a>
                <a href="/app/sales/campaigns" className="btn btn-outline-secondary">Campaigns</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">
              <h6 className="mb-0">Lead Pipeline</h6>
            </div>
            <div className="card-body">
              {leads.length === 0 ? (
                <p className="text-muted">No leads found</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="table table-sm">
                    <thead>
                      <tr><th>Name</th><th>Status</th><th>Position</th></tr>
                    </thead>
                    <tbody>
                      {leads.slice(0, 5).map((lead) => (
                        <tr key={lead.id}>
                          <td style={{ fontWeight: 500 }}>{lead.name}</td>
                          <td>
                            <span className={`statusTag ${lead.status === 'qualified' || lead.status === 'converted' ? 'active' : lead.status === 'lost' ? 'error' : 'pending'}`}>
                              {lead.status}
                            </span>
                          </td>
                          <td className="text-secondary">{lead.position || 'N/A'}</td>
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
              <a href="/app/sales/contacts" className="btn btn-secondary">Add New Lead</a>
              <a href="/app/sales/follow-ups" className="btn btn-secondary">Schedule Follow-up</a>
              <a href="/app/sales/reports" className="btn btn-secondary">View Reports</a>
              <a href="/app/sales/deals" className="btn btn-success">Export Leads</a>
            </div>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}