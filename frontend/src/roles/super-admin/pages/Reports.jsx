import React, { useState } from 'react';

export default function Reports() {
  const [reports, setReports] = useState([
    { id: 'REP-01', title: 'Monthly Executive Financial Summary', period: 'August 2026', generated: '2026-09-01', type: 'FINANCE', status: 'READY' },
    { id: 'REP-02', title: 'Tenant Growth & Churn Telemetry', period: 'Q2 2026', generated: '2026-07-01', type: 'BUSINESS', status: 'READY' },
    { id: 'REP-03', title: 'System SLA & Infrastructure Incident Audit', period: 'Last 90 Days', generated: '2026-09-05', type: 'SYSTEM', status: 'READY' },
    { id: 'REP-04', title: 'API Gateway Quota Consumption Report', period: 'August 2026', generated: '2026-09-02', type: 'DEVELOPER', status: 'READY' },
  ]);

  return (
    <div className="container-fluid p-3 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <i className="bi bi-bar-chart-line text-primary" aria-hidden="true"></i>
            Global Platform Reports & Auditing
          </h2>
          <p className="text-secondary small mb-0">
            Generate and export multi-tenant business intelligence, financial audits, and SLA compliance reports.
          </p>
        </div>
        <button className="btn btn-primary btn-sm d-flex align-items-center gap-1">
          <i className="bi bi-file-earmark-plus" aria-hidden="true"></i> Generate Custom Report
        </button>
      </div>

      <div className="card border-0 shadow-sm rounded-3 bg-white p-3">
        <h5 className="fw-bold mb-3">Published Executive Reports</h5>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Report ID</th>
                <th>Report Title</th>
                <th>Reporting Period</th>
                <th>Generated On</th>
                <th>Category</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(r => (
                <tr key={r.id}>
                  <td className="fw-bold font-monospace">{r.id}</td>
                  <td className="fw-semibold text-dark">{r.title}</td>
                  <td className="text-secondary small">{r.period}</td>
                  <td className="text-muted small">{r.generated}</td>
                  <td>
                    <span className="badge bg-light text-secondary border">{r.type}</span>
                  </td>
                  <td>
                    <span className="badge bg-success">{r.status}</span>
                  </td>
                  <td className="text-end">
                    <button className="btn btn-outline-primary btn-sm me-2">
                      <i className="bi bi-download" aria-hidden="true"></i> PDF
                    </button>
                    <button className="btn btn-outline-secondary btn-sm">
                      <i className="bi bi-filetype-csv" aria-hidden="true"></i> CSV
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
