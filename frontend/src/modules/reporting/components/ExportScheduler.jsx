import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function ExportScheduler() {
  const [form, setForm] = useState({ report: 'sales', format: 'csv', frequency: 'weekly' });

  const save = (e) => {
    e.preventDefault();
    alert('Export scheduled: ' + JSON.stringify(form));
  };

  return (
    <AdminPage title="Export Scheduler" subtitle="Schedule automated report exports">
      <div className="card" style={{ maxWidth: 600 }}>
        <div className="cardHeader"><h3 className="cardTitle">Schedule Export</h3></div>
        <form onSubmit={save} className="form">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="formGroup">
              <label className="label">Report</label>
              <select className="select" value={form.report} onChange={(e) => setForm({ ...form, report: e.target.value })}>
                <option value="sales">Sales</option>
                <option value="finance">Finance</option>
                <option value="hr">HR</option>
              </select>
            </div>
            <div className="formGroup">
              <label className="label">Format</label>
              <select className="select" value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value })}>
                <option value="csv">CSV</option>
                <option value="pdf">PDF</option>
                <option value="xlsx">Excel</option>
              </select>
            </div>
            <div className="formGroup">
              <label className="label">Frequency</label>
              <select className="select" value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn primary">Schedule</button>
        </form>
      </div>
    </AdminPage>
  );
}
