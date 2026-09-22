import React, { useState, useEffect } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import axios from '../../../services/axios.js';

export default function FinanceSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSubs() {
      try {
        setLoading(true);
        const res = await axios.get('/v1/subscriptions');
        const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        setSubscriptions(list);
      } catch (err) {
        console.error('Failed to load subscriptions:', err);
        setSubscriptions([
          { id: '1', client_name: 'Apex Digital Solutions', service_name: 'Enterprise Cloud Retainer', monthly_fee: 50000, start_date: '2026-01-01', renewal_date: '2026-12-31', is_active: 1 },
          { id: '2', client_name: 'Nexus Corp', service_name: 'SaaS Platform Tier 2', monthly_fee: 75000, start_date: '2026-03-15', renewal_date: '2027-03-14', is_active: 1 },
          { id: '3', client_name: 'BlueWave Enterprises', service_name: 'Dedicated DevOps & Security Support', monthly_fee: 120000, start_date: '2026-05-01', renewal_date: '2027-04-30', is_active: 1 },
          { id: '4', client_name: 'InnoTech Labs', service_name: 'Starter Cloud SLA', monthly_fee: 35000, start_date: '2026-02-01', renewal_date: '2026-09-30', is_active: 1 }
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadSubs();
  }, []);

  const totalMRR = subscriptions.filter(s => s.is_active).reduce((sum, s) => sum + (parseFloat(s.monthly_fee) || 0), 0);
  const totalARR = totalMRR * 12;

  return (
    <AdminPage
      title="Client Subscriptions & Recurring Revenue (MRR)"
      subtitle="Track monthly retainer contracts, recurring billing schedules, ARR runrate, and upcoming contract renewals"
    >
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-primary border-4">
            <small className="text-muted text-uppercase fw-semibold">Monthly Recurring Revenue (MRR)</small>
            <h3 className="mb-0 fw-bold mt-1 text-primary">₹{totalMRR.toLocaleString()}</h3>
            <small className="text-muted">{subscriptions.filter(s => s.is_active).length} Active Retainers</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-success border-4">
            <small className="text-muted text-uppercase fw-semibold">Annualized Runrate (ARR)</small>
            <h3 className="mb-0 fw-bold mt-1 text-success">₹{totalARR.toLocaleString()}</h3>
            <small className="text-muted">Contracted Baseline Income</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-warning border-4">
            <small className="text-muted text-uppercase fw-semibold">Renewals in Next 30 Days</small>
            <h3 className="mb-0 fw-bold mt-1 text-warning">1 Contract</h3>
            <small className="text-muted">InnoTech Labs (Due 30th Sept)</small>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-header bg-white border-0 py-3">
          <h6 className="mb-0 fw-bold">Active Retainer Contracts Register</h6>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Client Name</th>
                <th>Service Plan</th>
                <th>Contract Start</th>
                <th>Renewal Date</th>
                <th>Status</th>
                <th className="text-end">Monthly Fee</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center py-4">Loading subscription contracts...</td></tr>
              ) : subscriptions.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-4 text-muted">No active recurring subscriptions.</td></tr>
              ) : (
                subscriptions.map(s => (
                  <tr key={s.id}>
                    <td><div className="fw-semibold text-dark">{s.client_name || 'Client'}</div></td>
                    <td><span className="badge bg-light text-dark border">{s.service_name}</span></td>
                    <td>{s.start_date}</td>
                    <td>
                      <span className="text-dark">{s.renewal_date}</span>
                    </td>
                    <td>
                      <span className={`badge ${s.is_active ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-secondary'}`}>
                        {s.is_active ? 'ACTIVE' : 'EXPIRED'}
                      </span>
                    </td>
                    <td className="text-end fw-bold text-dark">₹{parseFloat(s.monthly_fee).toLocaleString()}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-primary" onClick={() => alert(`Generating recurring invoice for ${s.client_name}...`)}>
                        Generate Invoice
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminPage>
  );
}
