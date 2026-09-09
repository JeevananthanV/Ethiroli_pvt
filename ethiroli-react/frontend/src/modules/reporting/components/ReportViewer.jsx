import React, { useState } from 'react';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx';

export default function ReportViewer() {
  const [report, setReport] = useState('sales');

  return (
    <AdminPage title="Report Viewer" subtitle="View and export reports">
      <div className="card">
        <div className="cardHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="cardTitle">Report</h3>
          <select className="select" value={report} onChange={(e) => setReport(e.target.value)}>
            <option value="sales">Sales</option>
            <option value="finance">Finance</option>
            <option value="hr">HR</option>
          </select>
        </div>
        <div className="cardBody">
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--admin-text-secondary)' }}>
            <p>Report preview for: {report}</p>
            <button className="btn secondary" style={{ marginTop: 12 }} onClick={() => alert('Export ' + report)}>Export CSV</button>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
