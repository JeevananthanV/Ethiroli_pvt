import React, { useState } from 'react';

export default function Billing() {
  const [invoices, setInvoices] = useState([
    { id: 'INV-2026-0891', tenant: 'Apex EduTech Pvt Ltd', plan: 'Professional Tier', amount: '₹14,999', status: 'PAID', date: '2026-09-01', method: 'Razorpay Autopay' },
    { id: 'INV-2026-0892', tenant: 'Vanguard Global Institute', plan: 'Enterprise Tier', amount: '₹39,999', status: 'PAID', date: '2026-09-02', method: 'Stripe ACH' },
    { id: 'INV-2026-0893', tenant: 'Horizon Creative Labs', plan: 'Starter Tier', amount: '₹4,999', status: 'PENDING', date: '2026-09-05', method: 'UPI Netbanking' },
    { id: 'INV-2026-0894', tenant: 'Kaviarasu Technologies', plan: 'Professional Tier', amount: '₹14,999', status: 'PAID', date: '2026-09-07', method: 'Razorpay Cards' },
    { id: 'INV-2026-0895', tenant: 'Salem Skill Development Corp', plan: 'Enterprise Tier', amount: '₹39,999', status: 'PAID', date: '2026-09-08', method: 'Bank Transfer' },
  ]);

  return (
    <div className="container-fluid p-3 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <i className="bi bi-credit-card-2-front text-primary" aria-hidden="true"></i>
            Global Platform Billing & Invoices
          </h2>
          <p className="text-secondary small mb-0">
            Multi-tenant subscription invoices, payment gateway reconciliation, and revenue settlements.
          </p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
            <i className="bi bi-download" aria-hidden="true"></i> Export Statement
          </button>
          <button className="btn btn-primary btn-sm d-flex align-items-center gap-1">
            <i className="bi bi-gear" aria-hidden="true"></i> Gateway Settings
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="row g-3 mb-2">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-semibold text-uppercase">Total Collected (Sep 2026)</span>
            <h3 className="fw-bold text-success my-1">₹5,24,980</h3>
            <small className="text-muted">Across 42 settled transactions</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-semibold text-uppercase">Pending Invoices</span>
            <h3 className="fw-bold text-warning my-1">₹34,997</h3>
            <small className="text-muted">3 tenants due within 48h</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-semibold text-uppercase">Primary Gateway</span>
            <h3 className="fw-bold text-primary my-1">Razorpay Live</h3>
            <small className="text-success"><i className="bi bi-circle-fill me-1" style={{ fontSize: '0.5rem' }}></i>Healthy 99.9% uptime</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-semibold text-uppercase">Secondary Gateway</span>
            <h3 className="fw-bold text-dark my-1">Stripe Global</h3>
            <small className="text-success"><i className="bi bi-circle-fill me-1" style={{ fontSize: '0.5rem' }}></i>International FX Ready</small>
          </div>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="card border-0 shadow-sm rounded-3 bg-white p-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">Platform Invoices</h5>
          <span className="badge bg-light text-dark border">Recent 30 Days</span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Invoice #</th>
                <th>Tenant Organization</th>
                <th>Subscription Tier</th>
                <th>Amount</th>
                <th>Billing Date</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id}>
                  <td className="fw-semibold font-monospace">{inv.id}</td>
                  <td>
                    <div className="fw-medium text-dark">{inv.tenant}</div>
                  </td>
                  <td>
                    <span className="badge bg-light text-secondary border">{inv.plan}</span>
                  </td>
                  <td className="fw-bold text-dark">{inv.amount}</td>
                  <td className="text-secondary small">{inv.date}</td>
                  <td className="small text-muted">{inv.method}</td>
                  <td>
                    <span className={`badge ${inv.status === 'PAID' ? 'bg-success' : 'bg-warning text-dark'}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="text-end">
                    <button className="btn btn-outline-primary btn-sm py-1 px-2">
                      <i className="bi bi-file-earmark-arrow-down" aria-hidden="true"></i> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
