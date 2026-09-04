import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listReportDefinitions, executeReport } from '../../../services/api/reportApi.js';

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [executingId, setExecutingId] = useState(null);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listReportDefinitions();
      setReports(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleExecute = async (reportId) => {
    setExecutingId(reportId);
    try {
      await executeReport(reportId);
      alert('Report executed successfully!');
    } catch (err) {
      alert('Failed to execute report: ' + (err.message || 'Unknown error'));
    } finally {
      setExecutingId(null);
    }
  };

  return (
    <AdminPage
      title="Reports"
      subtitle="Generate, schedule, and review platform reports"
      loading={loading}
      error={error}
      onRetry={fetchReports}
      actions={
        <button className="btn primary btnSm" onClick={fetchReports} disabled={loading}>
          Refresh Reports
        </button>
      }
    >
      <div className="card">
        {reports.length === 0 ? (
          <div className="emptyState">
            <h3>No reports available</h3>
            <p>Create a new report definition to get started.</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td style={{ fontWeight: '500' }}>{report.name}</td>
                  <td style={{ color: 'var(--admin-text-secondary)' }}>{report.type || 'Standard'}</td>
                  <td>
                    <span className={`statusTag ${report.status === 'active' ? 'active' : 'inactive'}`}>
                      {report.status || 'inactive'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--admin-text-muted)', fontSize: '12px' }}>
                    {report.created_at ? new Date(report.created_at).toLocaleDateString() : '—'}
                  </td>
                  <td>
                    <button
                      className="btn primary btnSm"
                      onClick={() => handleExecute(report.id)}
                      disabled={executingId === report.id}
                    >
                      {executingId === report.id ? 'Running...' : 'Run'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminPage>
  );
}
